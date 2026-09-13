import { Router, Request, Response } from 'express';
import { PlacesService } from '../services/placesService';

const router = Router();

// GET /api/places/nearby?lat=...&lon=...&category=...
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const category = req.query.category as string;
    const radius = parseInt(req.query.radius as string) || 8000;

    if (isNaN(lat) || isNaN(lon)) {
      res.status(400).json({ error: 'Valid latitude (lat) and longitude (lon) query parameters are required.' });
      return;
    }

    const places = await PlacesService.findNearbyServices(lat, lon, category, radius);
    res.json({
      places,
      count: places.length,
      coordinates: { latitude: lat, longitude: lon },
      disclaimer: 'In an immediate life-threatening emergency, call official emergency lines (112 / 181) directly.'
    });
  } catch (err: any) {
    console.error('[Places Route Error]', err);
    res.status(500).json({ error: 'Failed to retrieve nearby emergency resources', details: err.message });
  }
});

export default router;
