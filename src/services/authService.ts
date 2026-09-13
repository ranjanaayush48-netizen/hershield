import { User as FirebaseUser } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { getSupabase } from '../lib/supabase';

// Firebase session is managed internally, but we keep this interface for compatibility
export interface AuthResponse {
  user: FirebaseUser | null;
  session: any | null;
  requiresEmailConfirmation?: boolean;
  message?: string;
  error?: string;
}

export interface UserProfileData {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  customSosMessage?: string;
}

export const AuthService = {
  isConfigured(): boolean {
    return isFirebaseConfigured;
  },

  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    if (!isFirebaseConfigured || !auth) {
      return {
        user: null,
        session: null,
        error: 'Firebase authentication is not configured. Please set environment variables.',
      };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      // Set the display name in Firebase
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName.trim()
        });
      }

      return {
        user: userCredential.user,
        session: {}, // Dummy session for compatibility
        requiresEmailConfirmation: false,
        message: 'Account created and signed in successfully.',
      };
    } catch (err: any) {
      let formattedError = err.message;
      if (err.code === 'auth/email-already-in-use') {
        formattedError = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        formattedError = 'Password is too weak. Please use at least 6 characters.';
      }
      return {
        user: null,
        session: null,
        error: formattedError || 'An unexpected error occurred during sign up.',
      };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (!isFirebaseConfigured || !auth) {
      return {
        user: null,
        session: null,
        error: 'Firebase authentication is not configured. Please set environment variables.',
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      return {
        user: userCredential.user,
        session: {}, // Dummy session for compatibility
        requiresEmailConfirmation: false,
      };
    } catch (err: any) {
      let formattedError = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        formattedError = 'Invalid email or password. Please verify your credentials and try again.';
      } else if (err.code === 'auth/network-request-failed') {
        formattedError = 'Unable to reach authentication server. Please check your network connection.';
      }
      return {
        user: null,
        session: null,
        error: formattedError || 'An unexpected error occurred during sign in.',
      };
    }
  },

  async signOut(): Promise<{ error?: string }> {
    if (!auth) return {};
    try {
      await firebaseSignOut(auth);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Sign out encountered an error.' };
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string; error?: string }> {
    if (!isFirebaseConfigured || !auth) {
      return {
        success: false,
        message: 'Firebase is not configured.',
        error: 'Missing Firebase credentials in environment.',
      };
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: 'Password reset email dispatched. Please check your inbox for instructions.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to dispatch password reset email.',
        error: err.message,
      };
    }
  },

  async getSession(): Promise<{ session: any | null; user: FirebaseUser | null }> {
    if (!isFirebaseConfigured || !auth) {
      return { session: null, user: null };
    }

    // With Firebase, session is typically managed via onAuthStateChanged,
    // but for compatibility we return current user.
    const user = auth.currentUser;
    if (!user) {
      return { session: null, user: null };
    }
    return { session: {}, user };
  },

  async fetchOrCreateProfile(user: FirebaseUser): Promise<UserProfileData> {
    const supabase = getSupabase();
    const fallbackProfile: UserProfileData = {
      id: user.uid,
      email: user.email || '',
      fullName: user.displayName || user.email?.split('@')[0] || 'Safety User',
      phone: user.phoneNumber || '',
      customSosMessage: 'EMERGENCY: I need urgent assistance. My live coordinates are attached.',
    };

    if (!supabase) {
      return fallbackProfile;
    }

    try {
      // 1. Try to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.uid)
        .maybeSingle();

      if (data && !error) {
        return {
          id: data.id,
          email: data.email || user.email || '',
          fullName: data.full_name || fallbackProfile.fullName,
          phone: data.phone || '',
          customSosMessage: data.custom_sos_message || fallbackProfile.customSosMessage,
        };
      }

      // 2. If profile does not exist yet, insert new profile record once
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.uid,
          email: user.email || '',
          full_name: fallbackProfile.fullName,
          phone: fallbackProfile.phone || '',
          custom_sos_message: fallbackProfile.customSosMessage,
        })
        .select()
        .maybeSingle();

      if (inserted && !insertError) {
        return {
          id: inserted.id,
          email: inserted.email || user.email || '',
          fullName: inserted.full_name || fallbackProfile.fullName,
          phone: inserted.phone || '',
          customSosMessage: inserted.custom_sos_message || fallbackProfile.customSosMessage,
        };
      }

      return fallbackProfile;
    } catch (err) {
      console.warn('[AuthService] Profiles table query error, using user metadata:', err);
      return fallbackProfile;
    }
  },
};
