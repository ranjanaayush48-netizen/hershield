import { getSupabaseAdmin, getSupabaseServiceAdmin } from '../config/supabase';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface ServerProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  emergency_pin_hash?: string;
  custom_sos_message: string;
  updated_at: string;
}

export interface ServerContact {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  phone: string;
  is_active: boolean;
  is_emergency: boolean;
  notify_on_sos: boolean;
  notify_on_location_share: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServerSosEvent {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  status: 'active' | 'resolved' | 'cancelled';
  contacts_notified_count: number;
  delivery_status: Array<{
    contact_name: string;
    phone: string;
    status: 'delivered' | 'pending' | 'failed' | 'simulated_local';
    provider_info?: string;
  }>;
  created_at: string;
  resolved_at?: string;
}

export interface ServerLocationSession {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  duration_minutes: number;
  share_token_hash: string;
  shared_contact_ids: string[];
  is_active: boolean;
  started_at: string;
  expires_at: string;
}

export interface ServerIncidentReport {
  id: string;
  user_id: string;
  incident_type: string;
  description: string;
  incident_date: string;
  incident_time?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  evidence_file_path?: string;
  evidence_file_name?: string;
  is_anonymous: boolean;
  status: 'submitted' | 'under_review' | 'resolved';
  created_at: string;
}

// In-memory + file-backed fallback stores for profile security and local dev
const CACHE_FILE = path.join(process.cwd(), '.data_store.json');

function loadFallbackProfiles(): Map<string, ServerProfile> {
  const map = new Map<string, ServerProfile>();
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (parsed.profiles && Array.isArray(parsed.profiles)) {
        for (const p of parsed.profiles) {
          if (p.id) map.set(p.id, p);
        }
      }
    }
  } catch (e) {}
  return map;
}

function saveFallbackProfiles(map: Map<string, ServerProfile>) {
  try {
    const profiles = Array.from(map.values());
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ profiles }, null, 2), 'utf8');
  } catch (e) {}
}

const fallbackProfiles: Map<string, ServerProfile> = loadFallbackProfiles();
const fallbackContacts: Map<string, ServerContact[]> = new Map();
const fallbackSosEvents: Map<string, ServerSosEvent[]> = new Map();
const fallbackSessions: Map<string, ServerLocationSession> = new Map();
const fallbackReports: Map<string, ServerIncidentReport[]> = new Map();

// Helper for default profile
function getDefaultProfile(userId: string, email = ''): ServerProfile {
  return {
    id: userId,
    email: email || 'user@hershield.safety',
    full_name: 'Verified User',
    phone: '',
    custom_sos_message: 'EMERGENCY: I need urgent assistance. My real-time location is shared via HerShield.',
    updated_at: new Date().toISOString()
  };
}

export const DataStore = {
  // Profiles
  async getProfile(userId: string, email?: string): Promise<ServerProfile> {
    const supabase = getSupabaseAdmin();
    const serviceAdmin = getSupabaseServiceAdmin();

    let secHash = fallbackProfiles.get(userId)?.emergency_pin_hash;

    if (serviceAdmin) {
      try {
        const { data: secData, error: secError } = await serviceAdmin
          .from('profile_security')
          .select('emergency_pin_hash')
          .eq('user_id', userId)
          .single();
        if (secData && !secError && secData.emergency_pin_hash) {
          secHash = secData.emergency_pin_hash;
        }
      } catch (err) {
        // preserve existing secHash
      }
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (data && !error) {
          const result: ServerProfile = {
            ...data,
            emergency_pin_hash: secHash
          };
          fallbackProfiles.set(userId, result);
          saveFallbackProfiles(fallbackProfiles);
          return result;
        }
      } catch (err) {
        console.warn('[DataStore] Supabase profiles query failed, falling back to local store:', err);
      }
    }

    if (!fallbackProfiles.has(userId)) {
      const def = getDefaultProfile(userId, email);
      if (secHash) def.emergency_pin_hash = secHash;
      fallbackProfiles.set(userId, def);
      saveFallbackProfiles(fallbackProfiles);
    }
    const profile = fallbackProfiles.get(userId)!;
    if (secHash && !profile.emergency_pin_hash) {
      profile.emergency_pin_hash = secHash;
    }
    return profile;
  },

  async updateProfile(userId: string, updates: Partial<ServerProfile>): Promise<ServerProfile> {
    const current = await this.getProfile(userId);
    const updated: ServerProfile = {
      ...current,
      ...updates,
      emergency_pin_hash: updates.emergency_pin_hash !== undefined ? updates.emergency_pin_hash : current.emergency_pin_hash,
      updated_at: new Date().toISOString()
    };

    const supabase = getSupabaseAdmin();
    const serviceAdmin = getSupabaseServiceAdmin();

    if (supabase) {
      try {
        const { emergency_pin_hash, ...profileData } = updated;
        await supabase.from('profiles').upsert(profileData);
      } catch (err) {
        console.warn('[DataStore] Supabase profile upsert error:', err);
      }
    }

    if (serviceAdmin && updated.emergency_pin_hash !== undefined) {
      try {
        await serviceAdmin.from('profile_security').upsert({
          user_id: userId,
          emergency_pin_hash: updated.emergency_pin_hash
        });
      } catch (err) {
        console.warn('[DataStore] Supabase profile_security upsert error:', err);
      }
    }

    fallbackProfiles.set(userId, updated);
    saveFallbackProfiles(fallbackProfiles);
    return updated;
  },

  // Contacts
  async getContacts(userId: string): Promise<ServerContact[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('[DataStore] Supabase contacts query failed:', error);
        throw new Error(`Failed to load trusted contacts from database: ${error.message}`);
      }
      return (data || []) as ServerContact[];
    }
    return fallbackContacts.get(userId) || [];
  },

  async addContact(userId: string, contact: Omit<ServerContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ServerContact> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .insert({
          user_id: userId,
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phone,
          is_active: contact.is_active !== undefined ? contact.is_active : true,
          is_emergency: contact.is_emergency !== undefined ? contact.is_emergency : true,
          notify_on_sos: contact.notify_on_sos !== undefined ? contact.notify_on_sos : true,
          notify_on_location_share: contact.notify_on_location_share !== undefined ? contact.notify_on_location_share : true,
        })
        .select()
        .single();
      if (error || !data) {
        console.error('[DataStore] Supabase contact insert failed:', error);
        throw new Error(`Failed to save trusted contact to database: ${error?.message || 'Unknown database error'}`);
      }
      return data as ServerContact;
    }

    const newContact: ServerContact = {
      ...contact,
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const userContacts = fallbackContacts.get(userId) || [];
    userContacts.push(newContact);
    fallbackContacts.set(userId, userContacts);
    return newContact;
  },

  async updateContact(userId: string, contactId: string, updates: Partial<ServerContact>): Promise<ServerContact | null> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', contactId)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) {
        console.error('[DataStore] Supabase contact update failed:', error);
        throw new Error(`Failed to update trusted contact in database: ${error.message}`);
      }
      return (data as ServerContact) || null;
    }

    const userContacts = fallbackContacts.get(userId) || [];
    const index = userContacts.findIndex(c => c.id === contactId);
    if (index === -1) return null;

    userContacts[index] = {
      ...userContacts[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    fallbackContacts.set(userId, userContacts);
    return userContacts[index];
  },

  async deleteContact(userId: string, contactId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .delete()
        .eq('id', contactId)
        .eq('user_id', userId)
        .select();
        
      if (error) {
        console.error('[DataStore] Supabase contact delete failed:', error);
        throw new Error(`Failed to delete trusted contact from database: ${error.message}`);
      }
      
      // If data is empty, it means no row was found to delete
      return data && data.length > 0;
    }

    const userContacts = fallbackContacts.get(userId) || [];
    const index = userContacts.findIndex(c => c.id === contactId);
    if (index === -1) return false;
    
    const filtered = userContacts.filter(c => c.id !== contactId);
    fallbackContacts.set(userId, filtered);
    return true;
  },

  // SOS Events
  async createSosEvent(event: Omit<ServerSosEvent, 'id' | 'created_at'>): Promise<ServerSosEvent> {
    const newEvent: ServerSosEvent = {
      ...event,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('sos_events')
        .insert(newEvent)
        .select()
        .single();
      if (error) {
        console.error('[DataStore] Supabase SOS insert error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Failed to insert SOS event into database: ${error.message} (code: ${error.code})`);
      }
      if (!data) {
        throw new Error('Failed to insert SOS event into database: No data returned.');
      }
      return data as ServerSosEvent;
    }

    const userEvents = fallbackSosEvents.get(event.user_id) || [];
    userEvents.unshift(newEvent);
    fallbackSosEvents.set(event.user_id, userEvents);
    return newEvent;
  },

  async resolveSosEvent(userId: string, eventId: string): Promise<ServerSosEvent | null> {
    const resolvedAt = new Date().toISOString();
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('sos_events')
        .update({ status: 'resolved', resolved_at: resolvedAt })
        .eq('id', eventId)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) {
        console.error('[DataStore] Supabase SOS resolve error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Failed to resolve SOS event in database: ${error.message} (code: ${error.code})`);
      }
      return data as ServerSosEvent;
    }

    const userEvents = fallbackSosEvents.get(userId) || [];
    const ev = userEvents.find(e => e.id === eventId);
    if (ev) {
      ev.status = 'resolved';
      ev.resolved_at = resolvedAt;
      return ev;
    }
    return null;
  },

  async getSosEvents(userId: string): Promise<ServerSosEvent[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('sos_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('[DataStore] Supabase SOS history query error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Failed to query SOS history from database: ${error.message} (code: ${error.code})`);
      }
      return data as ServerSosEvent[];
    }
    return fallbackSosEvents.get(userId) || [];
  },

  // Location Sessions
  async createLocationSession(session: Omit<ServerLocationSession, 'id' | 'started_at'>): Promise<ServerLocationSession> {
    const newSession: ServerLocationSession = {
      ...session,
      id: crypto.randomUUID(),
      started_at: new Date().toISOString()
    };

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('location_sessions')
          .insert(newSession)
          .select()
          .single();
        if (!error && data) return data as ServerLocationSession;
      } catch (err) {
        console.warn('[DataStore] Supabase location session insert failed:', err);
      }
    }

    fallbackSessions.set(session.share_token_hash, newSession);
    return newSession;
  },

  async getActiveSessionByTokenHash(tokenHash: string): Promise<ServerLocationSession | null> {
    const now = new Date().toISOString();
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('location_sessions')
          .select('*')
          .eq('share_token_hash', tokenHash)
          .eq('is_active', true)
          .gt('expires_at', now)
          .single();
        if (!error && data) return data as ServerLocationSession;
      } catch (err) {
        console.warn('[DataStore] Supabase token query failed:', err);
      }
    }

    const session = fallbackSessions.get(tokenHash);
    if (!session) return null;
    if (!session.is_active || new Date(session.expires_at).getTime() < Date.now()) {
      return null;
    }
    return session;
  },

  async updateLocationSessionByHash(tokenHash: string, updates: Partial<ServerLocationSession>): Promise<ServerLocationSession | null> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('location_sessions')
          .update(updates)
          .eq('share_token_hash', tokenHash)
          .select()
          .single();
        if (!error && data) return data as ServerLocationSession;
      } catch (err) {
        console.warn('[DataStore] Supabase location session update failed:', err);
      }
    }

    const session = fallbackSessions.get(tokenHash);
    if (!session) return null;
    
    // In a real DB this would update the row by tokenHash
    const updated = { ...session, ...updates };
    fallbackSessions.set(tokenHash, updated);
    return updated;
  },

  async stopLocationSession(userId: string, tokenHash?: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        let query = supabase.from('location_sessions').update({ is_active: false }).eq('user_id', userId);
        if (tokenHash) {
          query = query.eq('share_token_hash', tokenHash);
        }
        await query;
      } catch (err) {
        console.warn('[DataStore] Supabase location session stop failed:', err);
      }
    }

    for (const [t, s] of fallbackSessions.entries()) {
      if (s.user_id === userId && (!tokenHash || t === tokenHash)) {
        s.is_active = false;
      }
    }
    return true;
  },

  // Incident Reports
  async getReports(userId: string): Promise<ServerIncidentReport[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('incident_reports')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as ServerIncidentReport[];
      } catch (err) {
        console.warn('[DataStore] Supabase reports query failed:', err);
      }
    }
    return fallbackReports.get(userId) || [];
  },

  async addReport(userId: string, report: Omit<ServerIncidentReport, 'id' | 'user_id' | 'created_at'>): Promise<ServerIncidentReport> {
    const newReport: ServerIncidentReport = {
      ...report,
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: new Date().toISOString()
    };

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('incident_reports')
          .insert(newReport)
          .select()
          .single();
        if (!error && data) return data as ServerIncidentReport;
      } catch (err) {
        console.warn('[DataStore] Supabase report insert failed:', err);
      }
    }

    const userReports = fallbackReports.get(userId) || [];
    userReports.unshift(newReport);
    fallbackReports.set(userId, userReports);
    return newReport;
  }
};
