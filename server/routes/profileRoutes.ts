import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth';
import { DataStore } from '../storage/dataStore';

const router = Router();

function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(pin, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

// GET /api/profile
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await DataStore.getProfile(userId, req.user!.email);
    // Never send the hash to the frontend
    const { emergency_pin_hash, ...safeProfile } = profile;
    res.json({ profile: safeProfile });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve profile', details: err.message });
  }
});

// PUT /api/profile
router.put('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { full_name, phone, emergency_pin, custom_sos_message } = req.body;

    const updates: any = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    const rawPin = emergency_pin ?? req.body.emergencyPin ?? req.body.pin;
    if (rawPin !== undefined && rawPin !== null) {
      const pinStr = String(rawPin).trim();
      if (!/^\d{4}$/.test(pinStr)) {
        res.status(400).json({ error: 'PIN must be exactly 4 digits.' });
        return;
      }
      updates.emergency_pin_hash = hashPin(pinStr);
    }
    if (custom_sos_message !== undefined) updates.custom_sos_message = custom_sos_message;

    const profile = await DataStore.updateProfile(userId, updates);
    
    const { emergency_pin_hash, ...safeProfile } = profile;
    res.json({ profile: safeProfile, message: 'Safety profile updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

export default router;
