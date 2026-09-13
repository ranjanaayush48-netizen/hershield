import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth';
import { DataStore } from '../storage/dataStore';
import { NotificationService } from '../services/notificationService';
import { getSupabaseServiceAdmin } from '../config/supabase';

const router = Router();

function verifyPin(pin: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  
  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(String(pin).trim(), salt, 64);
    
    if (keyBuffer.length !== derivedKey.length) {
      return false;
    }
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    return false;
  }
}

// POST /api/sos/activate - Trigger real emergency SOS
router.post('/activate', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { latitude, longitude, accuracy, address, message } = req.body;

    // Check for an already active SOS event for this user
    const existingEvents = await DataStore.getSosEvents(userId);
    const existingActive = existingEvents.find(e => e.status === 'active');
    
    if (existingActive) {
      res.status(409).json({ 
        error: 'An emergency SOS is already active.',
        event: existingActive
      });
      return;
    }

    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({ error: 'Valid GPS coordinates (latitude, longitude) are required for emergency dispatch.' });
      return;
    }

    const latNum = typeof latitude === 'number' ? latitude : parseFloat(latitude);
    const lonNum = typeof longitude === 'number' ? longitude : parseFloat(longitude);
    const accNum = typeof accuracy === 'number' && !isNaN(accuracy) ? accuracy : 10;

    if (
      isNaN(latNum) ||
      isNaN(lonNum) ||
      (latNum === 0 && lonNum === 0) ||
      latNum < -90 ||
      latNum > 90 ||
      lonNum < -180 ||
      lonNum > 180
    ) {
      res.status(400).json({ 
        error: 'Valid non-zero GPS coordinates (latitude, longitude) are strictly required for emergency dispatch. Coordinates (0,0) are prohibited.' 
      });
      return;
    }

    // 1. Fetch user's active trusted contacts from database (enforces user ownership and security)
    const allUserContacts = await DataStore.getContacts(userId);
    const eligibleUserContacts = allUserContacts.filter(c => c.is_active && c.notify_on_sos);

    // Support optional recipient ID filtering from frontend, strictly validated against user's active contacts
    const requestedContactIds = req.body.recipient_contact_ids || req.body.contact_ids || req.body.selected_contact_ids;
    let activeEmergencyContacts = eligibleUserContacts;
    if (Array.isArray(requestedContactIds) && requestedContactIds.length > 0) {
      const allowedIdSet = new Set(requestedContactIds.map(String));
      activeEmergencyContacts = eligibleUserContacts.filter(c => allowedIdSet.has(c.id));
    }

    // 2. Fetch user custom message if none provided in request
    const profile = await DataStore.getProfile(userId, req.user!.email);
    const emergencyMessage = message || profile.custom_sos_message || 'EMERGENCY: I need urgent assistance. My live coordinates are attached.';

    // 3. Dispatch notifications via real provider adapter with exact coordinates (never trust frontend names/phones)
    const dispatchResult = await NotificationService.sendEmergencySos(
      activeEmergencyContacts.map(c => ({ id: c.id, name: c.name, phone: c.phone })),
      emergencyMessage,
      { latitude: latNum, longitude: lonNum, accuracy: accNum, address }
    );

    // 4. Save SOS event in database with exact coordinates and verified recipient count
    const sosEvent = await DataStore.createSosEvent({
      user_id: userId,
      latitude: latNum,
      longitude: lonNum,
      accuracy: accNum,
      address: address || `Lat: ${latNum.toFixed(4)}, Lon: ${lonNum.toFixed(4)}`,
      status: 'active',
      contacts_notified_count: activeEmergencyContacts.length,
      delivery_status: dispatchResult.results.map(r => ({
        contact_id: r.contact_id,
        contact_name: r.contact_name,
        phone: r.phone,
        status: r.status,
        provider_info: r.provider_info
      }))
    });

    res.status(201).json({
      success: true,
      event: sosEvent,
      dispatchedCount: activeEmergencyContacts.length,
      recipients: activeEmergencyContacts.map(c => ({
        id: c.id,
        name: c.name,
        relationship: c.relationship,
        phone: c.phone
      })),
      deliveryDetails: dispatchResult.results,
      disclaimer: dispatchResult.disclaimer,
      message: `Emergency SOS event recorded. Alert logged for ${activeEmergencyContacts.length} trusted contacts.`
    });
  } catch (err: any) {
    console.error('[SOS Activate Error]', err);
    res.status(500).json({ error: 'Failed to process emergency SOS', details: err.message });
  }
});

// POST /api/sos/deactivate - Deactivate SOS with PIN validation
router.post('/deactivate', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const submittedPin = req.body.pin ?? req.body.emergency_pin ?? req.body.emergencyPin;
    const pinStr = submittedPin !== undefined && submittedPin !== null ? String(submittedPin).trim() : '';
    if (!pinStr || !/^\d{4}$/.test(pinStr)) {
      res.status(403).json({ error: 'Emergency PIN is required to deactivate SOS.' });
      return;
    }

    let pinHash: string | null = null;
    const serviceAdmin = getSupabaseServiceAdmin();
    if (serviceAdmin) {
      try {
        const { data: secData, error: secError } = await serviceAdmin
          .from('profile_security')
          .select('emergency_pin_hash')
          .eq('user_id', userId)
          .single();
        if (secData && !secError && secData.emergency_pin_hash) {
          pinHash = secData.emergency_pin_hash;
        }
      } catch (err) {
        // Fall back to DataStore
      }
    }
    
    if (!pinHash) {
      const profile = await DataStore.getProfile(userId, req.user!.email);
      pinHash = profile.emergency_pin_hash || null;
    }

    if (!pinHash) {
      res.status(403).json({ error: 'No emergency PIN configured. SOS deactivation denied.' });
      return;
    }

    if (!verifyPin(pinStr, pinHash)) {
      res.status(403).json({ error: 'Incorrect Emergency Security PIN. SOS deactivation denied.' });
      return;
    }

    let targetEventIds: string[] = req.body.eventId ? [req.body.eventId] : [];

    if (targetEventIds.length === 0) {
      const recent = await DataStore.getSosEvents(userId);
      // Resolve ALL active events for this user to guarantee clear state
      targetEventIds = recent.filter(e => e.status === 'active').map(e => e.id);
    }

    if (targetEventIds.length > 0) {
      await Promise.all(targetEventIds.map(id => DataStore.resolveSosEvent(userId, id)));
    }

    res.json({
      success: true,
      message: 'Emergency SOS deactivated. Safety status restored.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to deactivate SOS', details: err.message });
  }
});

// GET /api/sos/history - Retrieve user's SOS events
router.get('/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const events = await DataStore.getSosEvents(userId);
    res.json({ events });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch SOS history', details: err.message });
  }
});

// GET /api/sos/status - Retrieve active SOS status and coordinates
router.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const events = await DataStore.getSosEvents(userId);
    const activeEvent = events.find(e => e.status === 'active') || null;
    res.json({
      isActive: Boolean(activeEvent),
      event: activeEvent
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch SOS status', details: err.message });
  }
});

export default router;
