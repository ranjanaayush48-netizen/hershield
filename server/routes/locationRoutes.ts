import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth';
import { DataStore } from '../storage/dataStore';

const router = Router();

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// GET /api/location/directions - Google Maps Routes API proxy (Compute Routes)
router.get('/directions', requireAuth, async (req: Request, res: Response) => {
  try {
    const origin = req.query.origin as string;
    const destination = req.query.destination as string;

    if (!origin || !destination) {
      res.status(400).json({ error: 'Origin and destination are required.' });
      return;
    }

    const apiKey = process.env.MAPS_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Google Maps API key is not configured.' });
      return;
    }

    const createWaypoint = (input: string) => {
      const parts = input.split(',');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          return { location: { latLng: { latitude: lat, longitude: lng } } };
        }
      }
      return { address: input.trim() };
    };

    const requestBody = {
      origin: createWaypoint(origin),
      destination: createWaypoint(destination),
      travelMode: 'WALK',
      languageCode: 'en-US',
      units: 'METRIC'
    };

    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs.steps.navigationInstruction.instructions,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();

    if (!response.ok || !data.routes || data.routes.length === 0) {
      res.status(400).json({ error: 'Failed to calculate route', details: data.error?.message || 'No routes found.' });
      return;
    }

    const formatDistance = (meters: number) => {
      if (!meters) return '0 m';
      if (meters < 1000) return `${meters} m`;
      return `${(meters / 1000).toFixed(1)} km`;
    };

    const formatDuration = (secondsStr: string) => {
      if (!secondsStr) return '0 min';
      const seconds = parseInt(secondsStr.replace('s', ''), 10);
      if (isNaN(seconds)) return '0 min';
      const mins = Math.round(seconds / 60);
      if (mins < 1) return '< 1 min';
      if (mins < 60) return `${mins} min`;
      const hrs = Math.floor(mins / 60);
      const remain = mins % 60;
      return remain > 0 ? `${hrs} hr ${remain} min` : `${hrs} hr`;
    };

    const route = data.routes[0];
    const leg = route.legs?.[0] || { steps: [] };

    const steps = (leg.steps || []).map((step: any) => ({
      instruction: step.navigationInstruction?.instructions || 'Proceed',
      distance: formatDistance(step.distanceMeters),
      duration: formatDuration(step.staticDuration)
    }));

    res.json({
      distance: formatDistance(route.distanceMeters),
      duration: formatDuration(route.duration),
      steps: steps,
      startAddress: origin.includes(',') ? 'Current Location' : origin,
      endAddress: destination.includes(',') ? 'Destination' : destination
    });
  } catch (err: any) {
    console.error('[Directions Route Error]', err);
    res.status(500).json({ error: 'Failed to fetch directions', details: err.message });
  }
});

// POST /api/location/start - Start a timed sharing session
router.post('/start', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { latitude, longitude, accuracy, address, duration_minutes, shared_contact_ids } = req.body;

    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({ error: 'Valid GPS latitude and longitude are required to start sharing.' });
      return;
    }

    const duration = Math.min(Math.max(Number(duration_minutes) || 15, 5), 480); // 5 mins to 8 hours
    const expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();
    
    // Generate secure random token and hash it for storage
    const rawToken = crypto.randomBytes(32).toString('hex');
    const shareTokenHash = hashToken(rawToken);

    const session = await DataStore.createLocationSession({
      user_id: userId,
      latitude,
      longitude,
      accuracy: accuracy || 10,
      address: address || 'Current reported coordinates',
      duration_minutes: duration,
      share_token_hash: shareTokenHash,
      shared_contact_ids: shared_contact_ids || [],
      is_active: true,
      expires_at: expiresAt
    });

    const { share_token_hash, ...safeSession } = session;
    res.status(201).json({
      session: safeSession,
      rawToken,
      shareUrl: `/api/location/track/${rawToken}`,
      message: `Live location sharing session active for ${duration} minutes.`
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to start location sharing', details: err.message });
  }
});

// POST /api/location/ping - Update coordinates during active session
router.post('/ping', requireAuth, async (req: Request, res: Response) => {
  try {
    const { token, latitude, longitude, accuracy, address } = req.body;

    if (!token || latitude === undefined || longitude === undefined) {
      res.status(400).json({ error: 'Session token and updated coordinates are required.' });
      return;
    }

    const tokenHash = hashToken(token);
    const updated = await DataStore.updateLocationSessionByHash(tokenHash, {
      latitude,
      longitude,
      accuracy: accuracy || 10,
      address: address || undefined
    });

    if (!updated) {
      res.status(404).json({ error: 'Location session not found or expired.' });
      return;
    }

    const { share_token_hash, ...safeSession } = updated;
    res.json({ success: true, session: safeSession });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update location', details: err.message });
  }
});

// POST /api/location/stop - Immediately stop location sharing
router.post('/stop', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { token } = req.body;
    
    // In our fallback data store, we don't have tokenHash in stopLocationSession.
    // It's just a fallback so we'll stop all for user.
    await DataStore.stopLocationSession(userId, token ? hashToken(token) : undefined);

    res.json({ success: true, message: 'Location sharing stopped successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to stop location sharing', details: err.message });
  }
});

// GET /api/location/track/:token - Ephemeral read for contacts
router.get('/track/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const tokenHash = hashToken(token);
    
    const session = await DataStore.getActiveSessionByTokenHash(tokenHash);

    if (!session) {
      res.status(410).json({
        error: 'Location sharing session has ended or expired.',
        isExpired: true
      });
      return;
    }

    res.json({
      latitude: session.latitude,
      longitude: session.longitude,
      accuracy: session.accuracy,
      address: session.address,
      expires_at: session.expires_at,
      started_at: session.started_at,
      duration_minutes: session.duration_minutes
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve location track', details: err.message });
  }
});

export default router;
