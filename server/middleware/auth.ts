import { Request, Response, NextFunction } from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { authContext, getSupabaseAdmin } from '../config/supabase';

// Initialize firebase-admin if not already initialized
if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'hershield-fad22'
  });
}

export interface AuthenticatedUser {
  id: string; // Internal HerShield UUID
  firebaseUid: string;
  email: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Authentication bearer token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Missing token in authorization header.' });
    return;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    if (!decodedToken) {
      res.status(401).json({ 
        error: `Unauthorized: Invalid or expired Firebase authentication session.` 
      });
      return;
    }

    const firebaseUid = decodedToken.uid;
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      res.status(500).json({ error: 'Database service is unavailable.' });
      return;
    }

    // Query public.firebase_user_mapping using the Firebase UID
    const { data: mapping, error: mappingError } = await supabase
      .from('firebase_user_mapping')
      .select('internal_user_id')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle();

    if (mappingError) {
      console.error('[requireAuth] Error querying firebase_user_mapping:', mappingError);
      res.status(500).json({ error: 'Failed to verify user profile mapping.' });
      return;
    }

    if (!mapping || !mapping.internal_user_id) {
      res.status(401).json({ 
        error: 'Unauthorized: This Firebase user has no HerShield profile mapping.' 
      });
      return;
    }

    req.user = {
      id: mapping.internal_user_id,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email || '',
      role: 'user',
    };

    // Inject the user token into the async context so downstream DataStore queries run as the user
    authContext.run(token, () => next());
  } catch (err: any) {
    console.error('[requireAuth] Firebase token verification failed:', err);
    res.status(401).json({ error: 'Unauthorized: Failed to verify authentication token.' });
  }
}
