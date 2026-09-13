export type SafetyStatusType = 'safe' | 'caution' | 'emergency';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  customSosMessage?: string;
  avatarUrl?: string;
  lastSafetyCheck: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isEmergency: boolean;
  isActive: boolean;
  notifyOnSos: boolean;
  notifyOnLocationShare: boolean;
  avatarColor?: string;
}

export type Contact = TrustedContact;

export type IncidentType = 'Harassment' | 'Stalking' | 'Threat' | 'Unsafe location' | 'Unsafe Location' | 'Other';

export interface EmergencyResource {
  id: string;
  name: string;
  category: string;
  distance: string;
  address: string;
  phone: string;
  isOpen: boolean;
  hours: string;
  verified: boolean;
  description: string;
  latitude: number;
  longitude: number;
}

export interface IncidentReport {
  id: string;
  type: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  evidenceFileName?: string;
  evidenceUploaded?: boolean;
  isAnonymous: boolean;
  status: 'submitted' | 'under_review' | 'resolved' | string;
  createdAt: number;
  shareWithCommunity?: boolean;
}

export interface LocationSession {
  isActive: boolean;
  durationMinutes: number;
  startedAt: number | null;
  expiresAt: number | null;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  address: string;
  sharedContactIds: string[];
  shareUrl?: string;
  rawToken?: string;
}

export interface FakeCallSettings {
  callerName: string;
  delaySeconds: number;
  voiceScenario: string;
  ringtoneSound: boolean;
}

export interface SafetyArticle {
  id: string;
  category: string;
  title: string;
  readTime: string;
  summary: string;
  keySteps: string[];
  fullGuide: string;
  author: string;
  iconName: string;
}

export interface SafeRouteData {
  startLocation: string;
  destination: string;
  safetyScore: number;
  estimatedTime: string;
  distance: string;
  wellLitRoadsPercent: number;
  publicSpotsCount: number;
  emergencyServicesNearby: number;
  routeActivityLevel: 'High Activity' | 'Moderate Activity' | 'Low Activity';
  safetyCheckpoints: string[];
  recommendation: string;
}
