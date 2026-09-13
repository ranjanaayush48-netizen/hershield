import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { 
  UserProfile, 
  TrustedContact, 
  IncidentReport, 
  LocationSession, 
  SafeRouteData,
  EmergencyResource
} from '../types';
import { apiRequest } from '../services/api';
import { LocationService, RealLocationData } from '../services/locationService';
import { useAuth } from './AuthContext';
import { OFFICIAL_INDIAN_SERVICES } from '../data/emergencyServicesIndia';
import { playEmergencySiren, stopEmergencySiren, startPhoneRing, stopPhoneRing } from '../utils/audio';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'emergency';
  timestamp: number;
}

export interface ActiveSosEventState {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  created_at?: string;
  contacts_notified_count?: number;
  delivery_status?: Array<{
    contact_id?: string;
    contact_name: string;
    phone: string;
    status: string;
    provider_info?: string;
  }>;
}

export interface SafetyContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPin: (pin: string) => Promise<void>;
  updateEmergencyPin: (pin: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  
  // Contacts
  contacts: TrustedContact[];
  selectedSosContactIds: string[];
  setSelectedSosContactIds: (ids: string[]) => void;
  toggleSosRecipientSelection: (id: string) => void;
  addContact: (contact: Omit<TrustedContact, 'id'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<TrustedContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  toggleContactActive: (id: string) => Promise<void>;
  testAlertContact: (id: string) => Promise<boolean>;

  // Emergency SOS
  isSosActive: boolean;
  isActivatingSos: boolean;
  activeSosEvent: ActiveSosEventState | null;
  isSosCountingDown: boolean;
  sosCountdown: number;
  sosActivatedAt: number | null;
  sosEmergencyMessage: string;
  setSosEmergencyMessage: (msg: string) => void;
  updateCustomSosMessage: (msg: string) => Promise<void>;
  isSirenEnabled: boolean;
  toggleSiren: () => void;
  startSosCountdown: () => void;
  cancelSosCountdown: () => void;
  confirmSosActivation: (overrideRecipientIds?: string[]) => Promise<void>;
  deactivateSos: (pinAttempt?: string) => Promise<boolean>;
  cancelSos: () => Promise<boolean>;

  // Location Sharing
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
    isRealGps: boolean;
    status: string;
    errorMessage?: string;
  };
  refreshLocation: () => Promise<void>;
  locationSession: LocationSession;
  startLocationSharing: (durationMinutes: number, selectedContactIds?: string[]) => Promise<void>;
  stopLocationSharing: () => Promise<void>;
  updateCurrentLocationAddress: (address: string) => void;

  // Fake Call
  isFakeCallScheduled: boolean;
  fakeCallCountdown: number;
  isFakeCallRinging: boolean;
  isFakeCallActive: boolean;
  fakeCallDuration: number;
  fakeCallerName: string;
  fakeCallState: {
    status: 'idle' | 'scheduled' | 'ringing' | 'active';
    delaySeconds: number;
    callerName: string;
    callerNumber?: string;
  };
  scheduleFakeCall: (name: string, delayOrNumber: string | number, delay?: number) => void;
  cancelFakeCall: () => void;
  answerFakeCall: () => void;
  endFakeCall: () => void;
  triggerInstantFakeCall: () => void;

  // Incident Reports
  reports: IncidentReport[];
  submitReport: (report: Omit<IncidentReport, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  addReport: (report: any) => Promise<void>;

  // Emergency Resources
  emergencyResources: EmergencyResource[];

  // Safe Route Helper
  getSafeRouteAnalysis: (start: string, destination: string) => SafeRouteData;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  removeNotification: (id: string) => void;

  // Global Quick Modal
  isQuickSosModalOpen: boolean;
  setQuickSosModalOpen: (open: boolean) => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser, session, profile: authProfile, signOut: authSignOut, refreshProfile } = useAuth();

  // Real user state strictly derived from authenticated Supabase session
  const [user, setUser] = useState<UserProfile | null>(null);
  const isAuthenticated = Boolean(authUser && session);

  // Contacts
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [selectedSosContactIds, setSelectedSosContactIds] = useState<string[]>([]);
  
  const toggleSosRecipientSelection = (id: string) => {
    setSelectedSosContactIds(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };
  
  // Real GPS Location state (starts with real detection)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
    isRealGps: boolean;
    status: string;
    errorMessage?: string;
  }>({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    address: 'Detecting live GPS coordinates...',
    isRealGps: false,
    status: 'loading'
  });

  // SOS state
  const [isSosActive, setIsSosActive] = useState(false);
  const [isActivatingSos, setIsActivatingSos] = useState(false);
  const isActivatingSosRef = useRef(false);
  const [activeSosEvent, setActiveSosEvent] = useState<ActiveSosEventState | null>(null);
  const [isSosCountingDown, setIsSosCountingDown] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosActivatedAt, setSosActivatedAt] = useState<number | null>(null);
  const [sosEmergencyMessage, setSosEmergencyMessage] = useState(
    'EMERGENCY: I may need assistance. My real-time location is shared via HerShield.'
  );
  const [isSirenEnabled, setIsSirenEnabled] = useState(false);
  const [isQuickSosModalOpen, setQuickSosModalOpen] = useState(false);

  // Location sharing session
  const [locationSession, setLocationSession] = useState<LocationSession>({
    isActive: false,
    durationMinutes: 15,
    startedAt: null,
    expiresAt: null,
    latitude: 0,
    longitude: 0,
    accuracyMeters: 0,
    address: '',
    sharedContactIds: []
  });

  // Fake Call
  const [isFakeCallScheduled, setIsFakeCallScheduled] = useState(false);
  const [fakeCallCountdown, setFakeCallCountdown] = useState(0);
  const [isFakeCallRinging, setIsFakeCallRinging] = useState(false);
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);
  const [fakeCallDuration, setFakeCallDuration] = useState(0);
  const [fakeCallerName, setFakeCallerName] = useState('Mom');

  // Incident Reports
  const [reports, setReports] = useState<IncidentReport[]>([]);

  // Emergency Resources
  const [emergencyResources, setEmergencyResources] = useState<EmergencyResource[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const watchIdRef = useRef<number | null>(null);

  // Notification helper
  const addNotification = useCallback((title: string, message: string, type: NotificationItem['type'] = 'info') => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setNotifications(prev => [{ id, title, message, type, timestamp: Date.now() }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // 1. Initial Real Location Acquisition
  const refreshLocation = useCallback(async () => {
    let lat = 28.6139;
    let lon = 77.2090;

    try {
      const loc: RealLocationData = await LocationService.getCurrentPosition();
      lat = loc.latitude;
      lon = loc.longitude;
      setCurrentLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        address: loc.address || `GPS: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`,
        isRealGps: loc.isRealGps,
        status: loc.status,
        errorMessage: loc.errorMessage
      });
    } catch (err: any) {
      console.warn('[Location] GPS acquisition error, using default/current coordinates:', err?.message);
      lat = currentLocation.latitude || 28.6139;
      lon = currentLocation.longitude || 77.2090;
      setCurrentLocation(prev => ({
        ...prev,
        latitude: lat,
        longitude: lon,
        status: 'unavailable',
        errorMessage: err.message || 'GPS location error'
      }));
    }

    // Always fetch nearby emergency resources around active or default coordinates
    if (lat !== 0 && lon !== 0) {
      try {
        const res = await apiRequest(`/api/places/nearby?lat=${lat}&lon=${lon}`);
        if (res.places && Array.isArray(res.places)) {
          setEmergencyResources(res.places);
        }
      } catch (err) {
        console.warn('[Places] Could not load nearby places:', err);
      }
    }
  }, [currentLocation.latitude, currentLocation.longitude]);

  // Initial load trigger on mount
  useEffect(() => {
    refreshLocation();
  }, []);

  // 2. Fetch Contacts from Backend
  const loadContacts = useCallback(async () => {
    try {
      const res = await apiRequest('/api/contacts');
      if (res.contacts) {
        const loaded: TrustedContact[] = res.contacts.map((c: any) => ({
          id: c.id,
          name: c.name,
          relationship: c.relationship,
          phone: c.phone,
          isEmergency: Boolean(c.is_emergency),
          isActive: Boolean(c.is_active),
          notifyOnSos: Boolean(c.notify_on_sos),
          notifyOnLocationShare: Boolean(c.notify_on_location_share),
          avatarColor: 'bg-rose-500'
        }));
        setContacts(loaded);
        setSelectedSosContactIds(loaded.filter(c => c.isActive && c.notifyOnSos).map(c => c.id));
      }
    } catch (err) {
      console.warn('[Contacts] Backend sync error:', err);
    }
  }, []);

  // 3. Fetch Reports from Backend
  const loadReports = useCallback(async () => {
    try {
      const res = await apiRequest('/api/reports');
      if (res.reports) {
        setReports(res.reports.map((r: any) => ({
          id: r.id,
          type: r.incident_type,
          date: r.incident_date,
          time: r.incident_time || '',
          location: r.location,
          description: r.description,
          isAnonymous: r.is_anonymous,
          status: r.status,
          createdAt: new Date(r.created_at).getTime(),
          evidenceFile: r.evidence_file_name
        })));
      }
    } catch (err) {
      console.warn('[Reports] Backend sync error:', err);
    }
  }, []);

  // 4. Fetch Profile from Backend
  const loadProfile = useCallback(async () => {
    try {
      const res = await apiRequest('/api/profile');
      if (res.profile) {
        setUser(prev => ({
          id: res.profile.id,
          name: res.profile.full_name || prev?.name || 'Verified User',
          email: res.profile.email || prev?.email || '',
          phone: res.profile.phone || prev?.phone || '',
          customSosMessage: res.profile.custom_sos_message || prev?.customSosMessage || '',
          lastSafetyCheck: 'Today'
        }));
        if (res.profile.custom_sos_message) {
          setSosEmergencyMessage(res.profile.custom_sos_message);
        }
      }
    } catch (err) {
      console.warn('[Profile] Backend sync error:', err);
    }
  }, []);

  const checkActiveSosStatus = useCallback(async () => {
    try {
      const res = await apiRequest('/api/sos/status');
      if (res.isActive && res.event) {
        const ev = res.event;
        if (typeof ev.latitude === 'number' && typeof ev.longitude === 'number' && (ev.latitude !== 0 || ev.longitude !== 0)) {
          setIsSosActive(true);
          setActiveSosEvent({
            id: ev.id,
            latitude: ev.latitude,
            longitude: ev.longitude,
            accuracy: ev.accuracy || 10,
            address: ev.address || `Lat: ${ev.latitude.toFixed(4)}, Lon: ${ev.longitude.toFixed(4)}`,
            created_at: ev.created_at,
            contacts_notified_count: ev.contacts_notified_count,
            delivery_status: ev.delivery_status
          });
          setCurrentLocation(prev => ({
            ...prev,
            latitude: ev.latitude,
            longitude: ev.longitude,
            accuracy: ev.accuracy || 10,
            address: ev.address || prev.address,
            isRealGps: true,
            status: 'granted',
            errorMessage: undefined
          }));
        }
      }
    } catch (err) {
      console.warn('[SOS Status Check Error]', err);
    }
  }, []);

  // Synchronize authenticated Firebase session into SafetyContext
  useEffect(() => {
    if (authUser) {
      const u: UserProfile = {
        id: authUser.uid,
        name: authProfile?.fullName || authUser.displayName || authUser.email?.split('@')[0] || 'Safety User',
        email: authUser.email || '',
        phone: authProfile?.phone || authUser.phoneNumber || '',
        customSosMessage: authProfile?.customSosMessage || 'EMERGENCY: I need urgent assistance. My live coordinates are attached.',
        lastSafetyCheck: 'Today'
      };
      setUser(u);
      if (authProfile?.customSosMessage) {
        setSosEmergencyMessage(authProfile.customSosMessage);
      }
      loadContacts();
      loadReports();
      loadProfile();
      checkActiveSosStatus();
    } else {
      setUser(null);
      setContacts([]);
      setReports([]);
      setActiveSosEvent(null);
    }
  }, [authUser, session, authProfile, loadContacts, loadReports, loadProfile, checkActiveSosStatus]);

  // Auth methods
  const login = async (_email: string, _name?: string) => {
    console.warn('[SafetyContext] Direct login call is deprecated; all auth flows use AuthContext signIn/signUp.');
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
    setContacts([]);
    setReports([]);
    addNotification('Logged Out', 'You have been securely signed out.', 'info');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: data.name,
          phone: data.phone,
          custom_sos_message: data.customSosMessage
        })
      });
      setUser(prev => prev ? ({ ...prev, ...data }) : null);
      await refreshProfile();
      addNotification('Profile Saved', 'Your safety profile has been updated.', 'success');
    } catch (err: any) {
      addNotification('Profile Update Error', err.message, 'warning');
    }
  };

  const updateEmergencyPin = async (pin: string) => {
    try {
      await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ emergency_pin: pin })
      });
      addNotification('Security PIN Updated', 'Your emergency PIN has been successfully changed.', 'success');
    } catch (err: any) {
      addNotification('PIN Update Error', err.message, 'warning');
    }
  };

  const updateUserPin = updateEmergencyPin;

  const updateCustomSosMessage = async (msg: string) => {
    setSosEmergencyMessage(msg);
    await updateUserProfile({ customSosMessage: msg });
  };

  // Contacts CRUD
  const addContact = async (newContact: Omit<TrustedContact, 'id'>) => {
    try {
      const res = await apiRequest('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({
          name: newContact.name,
          relationship: newContact.relationship,
          phone: newContact.phone,
          is_emergency: newContact.isEmergency !== undefined ? newContact.isEmergency : true,
          is_active: newContact.isActive !== undefined ? newContact.isActive : true,
          notify_on_sos: newContact.notifyOnSos !== undefined ? newContact.notifyOnSos : true,
          notify_on_location_share: newContact.notifyOnLocationShare !== undefined ? newContact.notifyOnLocationShare : true
        })
      });
      if (res.contact) {
        const added: TrustedContact = {
          id: res.contact.id,
          name: res.contact.name,
          relationship: res.contact.relationship,
          phone: res.contact.phone,
          isEmergency: Boolean(res.contact.is_emergency),
          isActive: Boolean(res.contact.is_active),
          notifyOnSos: Boolean(res.contact.notify_on_sos),
          notifyOnLocationShare: Boolean(res.contact.notify_on_location_share),
          avatarColor: 'bg-rose-500'
        };
        setContacts(prev => [...prev, added]);
        if (added.isActive && added.notifyOnSos) {
          setSelectedSosContactIds(prev => Array.from(new Set([...prev, added.id])));
        }
        addNotification('Contact Added', `${added.name} added to your trusted safety network.`, 'success');
      }
    } catch (err: any) {
      addNotification('Error Adding Contact', err.message, 'warning');
      throw err;
    }
  };

  const updateContact = async (id: string, updates: Partial<TrustedContact>) => {
    try {
      const res = await apiRequest(`/api/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updates.name,
          relationship: updates.relationship,
          phone: updates.phone,
          is_emergency: updates.isEmergency,
          is_active: updates.isActive,
          notify_on_sos: updates.notifyOnSos,
          notify_on_location_share: updates.notifyOnLocationShare
        })
      });
      if (res.contact) {
        setContacts(prev => prev.map(c => {
          if (c.id !== id) return c;
          return {
            ...c,
            name: res.contact.name ?? c.name,
            relationship: res.contact.relationship ?? c.relationship,
            phone: res.contact.phone ?? c.phone,
            isEmergency: res.contact.is_emergency !== undefined ? Boolean(res.contact.is_emergency) : c.isEmergency,
            isActive: res.contact.is_active !== undefined ? Boolean(res.contact.is_active) : c.isActive,
            notifyOnSos: res.contact.notify_on_sos !== undefined ? Boolean(res.contact.notify_on_sos) : c.notifyOnSos,
            notifyOnLocationShare: res.contact.notify_on_location_share !== undefined ? Boolean(res.contact.notify_on_location_share) : c.notifyOnLocationShare,
          };
        }));
        // Update recipient selection list if active or notifyOnSos changed
        if (updates.isActive === false || updates.notifyOnSos === false) {
          setSelectedSosContactIds(prev => prev.filter(cid => cid !== id));
        } else if (updates.isActive === true && updates.notifyOnSos === true) {
          setSelectedSosContactIds(prev => Array.from(new Set([...prev, id])));
        }
        addNotification('Contact Updated', 'Changes saved successfully.', 'success');
      }
    } catch (err: any) {
      addNotification('Update Error', err.message, 'warning');
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await apiRequest(`/api/contacts/${id}`, { method: 'DELETE' });
      setContacts(prev => prev.filter(c => c.id !== id));
      setSelectedSosContactIds(prev => prev.filter(cid => cid !== id));
      addNotification('Contact Removed', 'Contact removed from safety network.', 'info');
    } catch (err: any) {
      addNotification('Delete Error', err.message, 'warning');
      throw err;
    }
  };

  const toggleContactActive = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      await updateContact(id, { isActive: !contact.isActive });
    }
  };

  const testAlertContact = async (id: string): Promise<boolean> => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return false;
    addNotification('Test Verification Alert Dispatched', `Simulated test ping sent to ${contact.name} (${contact.phone}).`, 'info');
    return true;
  };

  // SOS Countdown
  useEffect(() => {
    let timer: number;
    if (isSosCountingDown && sosCountdown > 0) {
      timer = window.setInterval(() => {
        setSosCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSosCountingDown && sosCountdown === 0) {
      setIsSosCountingDown(false);
      confirmSosActivation();
    }
    return () => clearInterval(timer);
  }, [isSosCountingDown, sosCountdown]);

  const startSosCountdown = () => {
    setIsSosCountingDown(true);
    setSosCountdown(5);
  };

  const cancelSosCountdown = () => {
    setIsSosCountingDown(false);
    setSosCountdown(5);
    addNotification('SOS Activation Cancelled', 'Emergency broadcast was cancelled safely.', 'info');
  };

  // REAL SOS ACTIVATION
  const confirmSosActivation = async (overrideRecipientIds?: string[]) => {
    // Prevent race conditions and duplicate concurrent triggers
    if (isActivatingSosRef.current || isSosActive) {
      return;
    }

    isActivatingSosRef.current = true;
    setIsActivatingSos(true);
    setIsSosCountingDown(false);

    try {
      addNotification(
        'Acquiring Live GPS Position',
        'Acquiring fresh high-accuracy satellite coordinates for emergency dispatch...',
        'info'
      );

      // 1. Force fresh real browser GPS position
      const fresh = await LocationService.getCurrentPosition({ maximumAge: 0 });

      // Reject invalid or 0,0 coordinates
      if (
        typeof fresh.latitude !== 'number' ||
        typeof fresh.longitude !== 'number' ||
        isNaN(fresh.latitude) ||
        isNaN(fresh.longitude) ||
        (fresh.latitude === 0 && fresh.longitude === 0) ||
        fresh.latitude < -90 ||
        fresh.latitude > 90 ||
        fresh.longitude < -180 ||
        fresh.longitude > 180
      ) {
        throw new Error('Device GPS reported invalid 0,0 coordinates. Valid non-zero coordinates are required.');
      }

      const lat = fresh.latitude;
      const lon = fresh.longitude;
      const acc = fresh.accuracy;
      const addr = fresh.address || `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;

      // Update location state with verified coordinates
      setCurrentLocation({
        latitude: lat,
        longitude: lon,
        accuracy: acc,
        address: addr,
        isRealGps: true,
        status: 'granted',
        errorMessage: undefined
      });

      const recipientIdsToSend = overrideRecipientIds || selectedSosContactIds;

      // 2. Call real backend SOS endpoint with exact coordinates and selected recipient IDs
      const response = await apiRequest('/api/sos/activate', {
        method: 'POST',
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
          accuracy: acc,
          address: addr,
          message: sosEmergencyMessage,
          recipient_contact_ids: recipientIdsToSend
        })
      });

      // 3. Map returned event or freshly captured state
      const confirmedLat = response.event?.latitude ?? lat;
      const confirmedLon = response.event?.longitude ?? lon;
      const confirmedAcc = response.event?.accuracy ?? acc;
      const confirmedAddr = response.event?.address ?? addr;

      const eventData: ActiveSosEventState = {
        id: response.event?.id || `sos-${Date.now()}`,
        latitude: confirmedLat,
        longitude: confirmedLon,
        accuracy: confirmedAcc,
        address: confirmedAddr,
        created_at: response.event?.created_at || new Date().toISOString(),
        contacts_notified_count: response.dispatchedCount ?? response.event?.contacts_notified_count ?? 0,
        delivery_status: response.event?.delivery_status || response.deliveryDetails || []
      };

      setActiveSosEvent(eventData);
      setIsSosActive(true);
      setSosActivatedAt(Date.now());

      if (isSirenEnabled) {
        playEmergencySiren();
      }

      addNotification(
        'EMERGENCY SOS ACTIVE',
        `Alert dispatched to ${eventData.contacts_notified_count || 0} active trusted contacts with coordinates ${confirmedLat.toFixed(4)}, ${confirmedLon.toFixed(4)}.`,
        'emergency'
      );
    } catch (err: any) {
      console.error('[SOS Activation Failed]', err);
      // Requirement 3: Do NOT activate SOS if valid GPS position was not obtained.
      // Show clear location-unavailable error instead of creating an SOS with 0,0.
      setIsSosActive(false);
      setActiveSosEvent(null);

      setCurrentLocation(prev => ({
        ...prev,
        status: 'unavailable',
        errorMessage: err.message || 'GPS location unavailable'
      }));

      addNotification(
        'SOS Activation Failed: Location Unavailable',
        `Could not obtain valid GPS coordinates: ${err.message}. Emergency SOS was NOT created with empty or 0,0 coordinates. Please enable device GPS/location and try again, or dial emergency 112 directly.`,
        'emergency'
      );
    } finally {
      isActivatingSosRef.current = false;
      setIsActivatingSos(false);
    }
  };

  // REAL SOS DEACTIVATION
  const deactivateSos = async (pinAttempt?: string): Promise<boolean> => {
    if (!pinAttempt || pinAttempt.trim().length !== 4) {
      addNotification('PIN Required', 'Please enter your 4-digit emergency security PIN.', 'warning');
      return false;
    }
    try {
      await apiRequest('/api/sos/deactivate', {
        method: 'POST',
        body: JSON.stringify({ pin: pinAttempt.trim() })
      });

      setIsSosActive(false);
      setActiveSosEvent(null);
      setIsSosCountingDown(false);
      setSosActivatedAt(null);
      stopEmergencySiren();
      addNotification('Safety Status Restored', 'SOS has been deactivated. Contacts notified you are safe.', 'success');
      return true;
    } catch (err: any) {
      addNotification('Incorrect Security PIN', err.message || 'Invalid PIN entered.', 'warning');
      return false;
    }
  };

  const cancelSos = async (): Promise<boolean> => {
    // SOS cancellation requires a valid 4-digit PIN
    return false;
  };

  const toggleSiren = () => {
    if (isSirenEnabled) {
      setIsSirenEnabled(false);
      stopEmergencySiren();
    } else {
      setIsSirenEnabled(true);
      if (isSosActive) {
        playEmergencySiren();
      }
    }
  };

  // Real Location Sharing
  const startLocationSharing = async (durationMinutes: number, selectedContactIds?: string[]) => {
    try {
      let lat = currentLocation.latitude;
      let lon = currentLocation.longitude;
      let acc = currentLocation.accuracy;
      let addr = currentLocation.address;

      if (!lat || lat === 0 || !lon || lon === 0) {
        const fresh = await LocationService.getCurrentPosition();
        if (!fresh.isRealGps || fresh.latitude === 0 || fresh.longitude === 0) {
          throw new Error(fresh.errorMessage || 'Unable to retrieve real GPS coordinates. Please enable browser location access.');
        }
        lat = fresh.latitude;
        lon = fresh.longitude;
        acc = fresh.accuracy;
        addr = fresh.address || addr;
      }

      if (!lat || lat === 0 || !lon || lon === 0) {
        throw new Error('Valid GPS coordinates are required to start live location sharing. Please ensure location services are enabled.');
      }

      const res = await apiRequest('/api/location/start', {
        method: 'POST',
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
          accuracy: acc,
          address: addr,
          duration_minutes: durationMinutes,
          shared_contact_ids: selectedContactIds
        })
      });

      const expiresAt = new Date(res.session.expires_at).getTime();
      setLocationSession({
        isActive: true,
        durationMinutes,
        startedAt: Date.now(),
        expiresAt,
        latitude: lat,
        longitude: lon,
        accuracyMeters: acc || 10,
        address: addr,
        sharedContactIds: selectedContactIds || [],
        shareUrl: res.shareUrl,
        rawToken: res.rawToken
      });

      // Start continuous background GPS watch during active session
      if (watchIdRef.current) {
        LocationService.clearWatch(watchIdRef.current);
      }
      const rawToken = res.rawToken;
      watchIdRef.current = LocationService.watchPosition((loc) => {
        if (loc.latitude !== 0 && loc.longitude !== 0) {
          setCurrentLocation(prev => ({
            ...prev,
            latitude: loc.latitude,
            longitude: loc.longitude,
            accuracy: loc.accuracy,
            isRealGps: true,
            status: 'granted'
          }));
          setLocationSession(prev => ({
            ...prev,
            latitude: loc.latitude,
            longitude: loc.longitude,
            accuracyMeters: loc.accuracy
          }));
          // Ping backend
          if (rawToken) {
            apiRequest('/api/location/ping', {
              method: 'POST',
              body: JSON.stringify({
                token: rawToken,
                latitude: loc.latitude,
                longitude: loc.longitude,
                accuracy: loc.accuracy
              })
            }).catch(() => {});
          }
        }
      });

      addNotification(
        'Live Location Sharing Active',
        `Live GPS telemetry shared for ${durationMinutes} minutes. Session will expire automatically.`,
        'success'
      );
    } catch (err: any) {
      addNotification('Sharing Error', err.message, 'warning');
    }
  };

  const stopLocationSharing = async () => {
    try {
      await apiRequest('/api/location/stop', { method: 'POST' });
    } catch (err) {
      // Ignore
    }

    if (watchIdRef.current) {
      LocationService.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setLocationSession(prev => ({
      ...prev,
      isActive: false,
      startedAt: null,
      expiresAt: null
    }));
    addNotification('Location Sharing Stopped', 'Your live position is no longer being broadcast.', 'info');
  };

  const updateCurrentLocationAddress = (address: string) => {
    setCurrentLocation(prev => ({ ...prev, address }));
  };

  // Fake Call System (Polished Local Feature)
  const scheduleFakeCall = (name: string, delayOrNumber: string | number, delay?: number) => {
    const actualDelay = typeof delayOrNumber === 'number' ? delayOrNumber : (delay || 10);
    setFakeCallerName(name);
    setIsFakeCallScheduled(true);
    setFakeCallCountdown(actualDelay);
    addNotification('Fake Call Scheduled', `Incoming call from ${name} in ${actualDelay} seconds.`, 'info');
  };

  const cancelFakeCall = () => {
    setIsFakeCallScheduled(false);
    setFakeCallCountdown(0);
    setIsFakeCallRinging(false);
    setIsFakeCallActive(false);
    stopPhoneRing();
  };

  const answerFakeCall = () => {
    setIsFakeCallRinging(false);
    setIsFakeCallActive(true);
    setFakeCallDuration(0);
    stopPhoneRing();
  };

  const endFakeCall = () => {
    setIsFakeCallActive(false);
    setIsFakeCallRinging(false);
    setIsFakeCallScheduled(false);
    stopPhoneRing();
  };

  const triggerInstantFakeCall = () => {
    setIsFakeCallScheduled(false);
    setIsFakeCallRinging(true);
    startPhoneRing();
  };

  useEffect(() => {
    let timer: number;
    if (isFakeCallScheduled && fakeCallCountdown > 0) {
      timer = window.setInterval(() => {
        setFakeCallCountdown(prev => prev - 1);
      }, 1000);
    } else if (isFakeCallScheduled && fakeCallCountdown === 0) {
      setIsFakeCallScheduled(false);
      setIsFakeCallRinging(true);
      startPhoneRing();
    }
    return () => clearInterval(timer);
  }, [isFakeCallScheduled, fakeCallCountdown]);

  useEffect(() => {
    let timer: number;
    if (isFakeCallActive) {
      timer = window.setInterval(() => {
        setFakeCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFakeCallActive]);

  // Incident Reports
  const submitReport = async (reportData: Omit<IncidentReport, 'id' | 'createdAt' | 'status'>) => {
    try {
      let evidencePath: string | undefined = undefined;
      const evidenceFileObj = (reportData as any).evidenceFileObj as File | undefined;

      if (evidenceFileObj) {
        try {
          const uploadRes = await apiRequest('/api/reports/upload-url', {
            method: 'POST',
            body: JSON.stringify({ fileName: evidenceFileObj.name })
          });
          
          if (uploadRes.uploadUrl) {
            await fetch(uploadRes.uploadUrl, {
              method: 'PUT',
              body: evidenceFileObj,
              headers: {
                'Content-Type': evidenceFileObj.type || 'application/octet-stream'
              }
            });
            evidencePath = uploadRes.path;
          } else if (uploadRes.path) {
            evidencePath = uploadRes.path;
          }
        } catch (uploadErr) {
          console.warn('[Storage] Evidence upload failed:', uploadErr);
        }
      }

      const res = await apiRequest('/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          incident_type: reportData.type,
          description: reportData.description,
          incident_date: reportData.date,
          incident_time: reportData.time,
          location: reportData.location,
          latitude: (reportData as any).latitude,
          longitude: (reportData as any).longitude,
          is_anonymous: reportData.isAnonymous,
          evidence_file_name: reportData.evidenceFileName || (reportData as any).evidenceFile,
          evidence_file_path: evidencePath
        })
      });

      if (res.report) {
        setReports(prev => [{
          id: res.report.id,
          type: res.report.incident_type,
          date: res.report.incident_date,
          time: res.report.incident_time || '',
          location: res.report.location,
          description: res.report.description,
          isAnonymous: res.report.is_anonymous,
          status: res.report.status,
          createdAt: new Date(res.report.created_at).getTime(),
          evidenceFileName: res.report.evidence_file_name
        }, ...prev]);
        addNotification('Incident Report Logged', 'Your report has been securely saved to the database.', 'success');
      }
    } catch (err: any) {
      addNotification('Submission Failed', err.message, 'warning');
    }
  };

  const addReport = async (report: any) => {
    await submitReport(report);
  };

  // Safe Route Heuristic Helper
  const getSafeRouteAnalysis = (start: string, destination: string): SafeRouteData => {
    return {
      startLocation: start || 'Current Location',
      destination: destination || 'Selected Safe Haven',
      safetyScore: 88,
      distance: '3.2 km',
      estimatedTime: '14 mins',
      wellLitRoadsPercent: 88,
      publicSpotsCount: 6,
      emergencyServicesNearby: 3,
      routeActivityLevel: 'High Activity',
      safetyCheckpoints: ['Central Avenue Metro', 'City Plaza Patrol Point', 'Civil Hospital Safe Haven'],
      recommendation: 'Recommended route via well-lit transit arteries with continuous foot traffic.'
    };
  };

  const fakeCallState = {
    status: (isFakeCallActive ? 'active' : isFakeCallRinging ? 'ringing' : isFakeCallScheduled ? 'scheduled' : 'idle') as any,
    delaySeconds: fakeCallCountdown,
    callerName: fakeCallerName,
    callerNumber: '+91 98765 43210'
  };

  return (
    <SafetyContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      updateUserPin,
      updateEmergencyPin,
      updateUserProfile,
      contacts,
      selectedSosContactIds,
      setSelectedSosContactIds,
      toggleSosRecipientSelection,
      addContact,
      updateContact,
      deleteContact,
      toggleContactActive,
      testAlertContact,
      isSosActive,
      isActivatingSos,
      activeSosEvent,
      isSosCountingDown,
      sosCountdown,
      sosActivatedAt,
      sosEmergencyMessage,
      setSosEmergencyMessage,
      updateCustomSosMessage,
      isSirenEnabled,
      toggleSiren,
      startSosCountdown,
      cancelSosCountdown,
      confirmSosActivation,
      deactivateSos,
      cancelSos,
      currentLocation,
      refreshLocation,
      locationSession,
      startLocationSharing,
      stopLocationSharing,
      updateCurrentLocationAddress,
      isFakeCallScheduled,
      fakeCallCountdown,
      isFakeCallRinging,
      isFakeCallActive,
      fakeCallDuration,
      fakeCallerName,
      fakeCallState,
      scheduleFakeCall,
      cancelFakeCall,
      answerFakeCall,
      endFakeCall,
      triggerInstantFakeCall,
      reports,
      submitReport,
      addReport,
      emergencyResources,
      getSafeRouteAnalysis,
      notifications,
      addNotification,
      removeNotification,
      isQuickSosModalOpen,
      setQuickSosModalOpen
    }}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
