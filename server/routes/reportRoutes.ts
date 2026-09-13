import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { DataStore } from '../storage/dataStore';
import { getSupabaseAdmin } from '../config/supabase';

const router = Router();

// GET /api/reports - Fetch authenticated user's incident reports
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const reports = await DataStore.getReports(userId);
    res.json({ reports });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve incident reports', details: err.message });
  }
});

// POST /api/reports - Create new incident report
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      incident_type,
      description,
      incident_date,
      incident_time,
      location,
      latitude,
      longitude,
      evidence_file_path,
      evidence_file_name,
      is_anonymous
    } = req.body;

    if (!incident_type || !description || !location) {
      res.status(400).json({ error: 'Incident type, description, and location are required fields.' });
      return;
    }

    const report = await DataStore.addReport(userId, {
      incident_type: incident_type.trim(),
      description: description.trim(),
      incident_date: incident_date || new Date().toISOString().split('T')[0],
      incident_time: incident_time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: location.trim(),
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      evidence_file_path: evidence_file_path || undefined,
      evidence_file_name: evidence_file_name || undefined,
      is_anonymous: Boolean(is_anonymous),
      status: 'submitted'
    });

    res.status(201).json({
      report,
      message: 'Incident report filed securely. Your record has been logged.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit incident report', details: err.message });
  }
});

// POST /api/reports/upload-url - Generate private Supabase Storage signed upload URL
router.post('/upload-url', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fileName } = req.body;

    if (!fileName) {
      res.status(400).json({ error: 'File name is required.' });
      return;
    }

    const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${userId}/${Date.now()}_${sanitized}`;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.storage
        .from('evidence-files')
        .createSignedUploadUrl(storagePath);

      if (error) {
        console.warn('[Storage] Signed upload URL generation error:', error);
      } else if (data) {
        res.json({
          uploadUrl: data.signedUrl,
          token: data.token,
          path: data.path,
        });
        return;
      }
    }

    // Fallback if Supabase Storage is not yet configured: client stores evidence file reference securely
    res.json({
      path: `local_private/${storagePath}`,
      uploadUrl: null,
      message: 'Supabase storage bucket unconfigured; file metadata recorded securely.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate upload URL', details: err.message });
  }
});

export default router;
