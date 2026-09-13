import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthService, AuthResponse, UserProfileData } from '../services/authService';

interface AuthContextType {
  user: FirebaseUser | null;
  session: any | null;
  profile: UserProfileData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigured] = useState<boolean>(isFirebaseConfigured);

  const profileFetchInProgressRef = useRef<string | null>(null);

  const loadUserProfile = useCallback(async (currentUser: FirebaseUser) => {
    if (profileFetchInProgressRef.current === currentUser.uid) {
      return;
    }
    profileFetchInProgressRef.current = currentUser.uid;

    try {
      const userProfile = await AuthService.fetchOrCreateProfile(currentUser);
      setProfile(userProfile);
    } catch (err) {
      console.warn('[AuthContext] Failed to load user profile:', err);
    } finally {
      profileFetchInProgressRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setSession(firebaseUser ? {} : null); // Dummy session

      if (firebaseUser) {
        await loadUserProfile(firebaseUser);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [loadUserProfile]);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await AuthService.signIn(email, password);
    // User state will be updated by onAuthStateChanged
    return res;
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    const res = await AuthService.signUp(email, password, fullName);
    // User state will be updated by onAuthStateChanged
    return res;
  };

  const signOut = async (): Promise<void> => {
    await AuthService.signOut();
    // User state will be updated by onAuthStateChanged
  };

  const resetPassword = async (email: string) => {
    return AuthService.resetPassword(email);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: Boolean(user),
        isLoading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
