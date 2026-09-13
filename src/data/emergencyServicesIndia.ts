export interface OfficialEmergencyNumber {
  id: string;
  name: string;
  number: string;
  category: 'national' | 'women' | 'medical' | 'police';
  description: string;
  badge: string;
  availability: string;
  tollFree: boolean;
}

export const OFFICIAL_INDIAN_SERVICES: OfficialEmergencyNumber[] = [
  {
    id: 'erss-112',
    name: 'National Emergency Helpline (ERSS)',
    number: '112',
    category: 'national',
    description: 'Unified Emergency Response Support System for Police, Fire, Ambulance, and Disaster assistance across all Indian States.',
    badge: 'All-in-One Emergency',
    availability: '24/7 / 365 Days',
    tollFree: true,
  },
  {
    id: 'whl-181',
    name: 'Women Helpline (Ministry of WCD)',
    number: '181',
    category: 'women',
    description: '24/7 confidential emergency response, rescue, crisis intervention, counseling, and legal aid referral for women in distress.',
    badge: 'Official Women Helpline',
    availability: '24/7 Immediate Response',
    tollFree: true,
  },
  {
    id: 'police-1091',
    name: 'Women in Distress (State Police)',
    number: '1091',
    category: 'women',
    description: 'Direct police patrol dispatch and PCR van intervention for harassment, stalking, or urgent danger in public or private spaces.',
    badge: 'Direct Police Dispatch',
    availability: '24/7 Patrol Dispatch',
    tollFree: true,
  },
  {
    id: 'medical-108',
    name: 'National Ambulance & Medical Service',
    number: '108',
    category: 'medical',
    description: 'Emergency medical technician response, trauma management, and rapid hospital transit during severe accidents or crises.',
    badge: 'Medical Emergency',
    availability: '24/7 Ambulance Fleet',
    tollFree: true,
  },
  {
    id: 'cyber-1930',
    name: 'National Cyber Crime Reporting Helpline',
    number: '1930',
    category: 'national',
    description: 'Rapid response for cyber harassment, non-consensual image distribution, online stalking, and digital extortion.',
    badge: 'Cyber Safety Cell',
    availability: '24/7 National Portal',
    tollFree: true,
  }
];

export const OFFICIAL_DISCLAIMER = 
  "DISCLAIMER: HerShield is a personal security companion and trusted-circle notification tool. It does not replace official police or government emergency dispatch. In an immediate emergency, contact official emergency services directly by dialing 112 or 181.";
