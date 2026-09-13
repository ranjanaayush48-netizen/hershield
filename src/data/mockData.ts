import { TrustedContact, EmergencyResource, SafetyArticle, IncidentReport } from '../types';

export const INITIAL_CONTACTS: TrustedContact[] = [
  {
    id: 'tc-1',
    name: 'Elena Rostova',
    relationship: 'Sister',
    phone: '+1 (555) 482-9912',
    isEmergency: true,
    isActive: true,
    notifyOnSos: true,
    notifyOnLocationShare: true,
    avatarColor: 'bg-rose-500'
  },
  {
    id: 'tc-2',
    name: 'Maya Lin',
    relationship: 'Best Friend',
    phone: '+1 (555) 739-1145',
    isEmergency: true,
    isActive: true,
    notifyOnSos: true,
    notifyOnLocationShare: true,
    avatarColor: 'bg-purple-500'
  },
  {
    id: 'tc-3',
    name: 'David Miller',
    relationship: 'Partner',
    phone: '+1 (555) 203-8874',
    isEmergency: false,
    isActive: true,
    notifyOnSos: true,
    notifyOnLocationShare: false,
    avatarColor: 'bg-teal-500'
  },
  {
    id: 'tc-4',
    name: 'Sarah Jenkins',
    relationship: 'Colleague',
    phone: '+1 (555) 914-3320',
    isEmergency: false,
    isActive: false,
    notifyOnSos: false,
    notifyOnLocationShare: false,
    avatarColor: 'bg-indigo-500'
  }
];

export const EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    id: 'res-1',
    name: 'Central Metropolitan Police Precinct',
    category: 'police',
    distance: '0.8 miles',
    address: '450 Civic Center Plaza, Downtown',
    phone: '+1 (555) 911-0021',
    isOpen: true,
    hours: '24/7 Emergency Dispatch',
    verified: true,
    description: 'Dedicated women and vulnerable citizens rapid response unit with trained crisis counselors.',
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: 'res-2',
    name: 'St. Jude Memorial Hospital Trauma Center',
    category: 'hospital',
    distance: '1.2 miles',
    address: '890 Healthcare Way, Medical District',
    phone: '+1 (555) 344-9000',
    isOpen: true,
    hours: '24/7 Level 1 Emergency',
    verified: true,
    description: 'Full emergency room, acute forensic nursing, and confidential medical crisis support.',
    latitude: 37.7690,
    longitude: -122.4467
  },
  {
    id: 'res-3',
    name: 'Metro City Rapid Ambulance Service',
    category: 'ambulance',
    distance: '0.5 miles',
    address: '120 Station St, Logistics Hub',
    phone: '+1 (555) 888-2628',
    isOpen: true,
    hours: '24/7 Immediate Dispatch',
    verified: true,
    description: 'Direct dispatch paramedic network equipped with live GPS tracking response.',
    latitude: 37.7833,
    longitude: -122.4167
  },
  {
    id: 'res-4',
    name: 'National Women Safety & Domestic Crisis Line',
    category: 'helpline',
    distance: 'Direct Toll-Free',
    address: 'Confidential 24/7 Voice & Text Hotline',
    phone: '1-800-799-7233',
    isOpen: true,
    hours: '24 Hours / 365 Days',
    verified: true,
    description: 'Confidential crisis intervention, safety planning, and immediate referral services.',
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: 'res-5',
    name: 'Haven Community Safe Sanctuary & Shelter',
    category: 'shelter',
    distance: '2.4 miles',
    address: 'Safe Access Point (Call for Verified Intake)',
    phone: '+1 (555) 437-8321',
    isOpen: true,
    hours: '24/7 Emergency Sanctuary',
    verified: true,
    description: 'Emergency confidential transitional lodging, food, child support, and legal guidance.',
    latitude: 37.7558,
    longitude: -122.4241
  },
  {
    id: 'res-6',
    name: 'Justice & Rights Advocacy Legal Aid',
    category: 'legal',
    distance: '1.7 miles',
    address: '220 Court St, Suite 400',
    phone: '+1 (555) 672-1980',
    isOpen: true,
    hours: 'Mon-Sat 8:00 AM - 8:00 PM (Emergency on-call)',
    verified: true,
    description: 'Pro-bono legal advocacy, emergency protection orders, restraining orders, and advisory.',
    latitude: 37.7812,
    longitude: -122.4089
  }
];

export const SAFETY_ARTICLES: SafetyArticle[] = [
  {
    id: 'art-1',
    category: 'Emergency Preparedness',
    title: 'Designing an Unbreakable Personal Emergency Protocol',
    readTime: '4 min read',
    summary: 'Practical tactical steps to configure your smartphone, trusted contacts, and rapid check-ins before dangerous situations.',
    keySteps: [
      'Program 3 trusted contacts with specific escalation roles',
      'Memorize your two closest 24/7 public safe havens',
      'Keep your primary phone battery above 30% or carry an external power card',
      'Test your silent SOS shortcuts every month'
    ],
    fullGuide: 'Personal security begins with proactive preparation rather than reactive panic. When planning trips alone at night or in unfamiliar urban spaces, audit your route beforehand. Ensure your mobile device has emergency bypass enabled so trusted calls ring through even during Do Not Disturb mode.',
    author: 'Chief Security Officer Karen Vance',
    iconName: 'ShieldAlert'
  },
  {
    id: 'art-2',
    category: 'Online Safety',
    title: 'Digital Privacy & Anti-Stalking Defense Checklist',
    readTime: '5 min read',
    summary: 'How to lock down location metadata on social apps, detect unauthorized tracking devices, and protect personal identifiers.',
    keySteps: [
      'Revoke continuous background location permissions for social media apps',
      'Perform weekly scans for unknown Bluetooth tracker tags',
      'Use masked virtual phone numbers when using marketplace apps',
      'Never post real-time location stories until after you have left the venue'
    ],
    fullGuide: 'Modern stalkers frequently exploit passive digital breadcrumbs. Many photo uploads carry EXIF coordinates unless stripped. Regularly review active logins on your cloud accounts and ensure two-factor authentication is bound to an authenticator app rather than unencrypted SMS.',
    author: 'Cybersecurity Analyst Nina Chen',
    iconName: 'Laptop'
  },
  {
    id: 'art-3',
    category: 'Travel Safety',
    title: 'Solo Commuting & Ride-Share Verification Protocols',
    readTime: '6 min read',
    summary: 'The 3-point ride-share check, staying alert on public transit, and handling uncomfortable interactions tactfully.',
    keySteps: [
      'Always verify driver name, license plate, and make before unlocking the door',
      'Sit behind the driver rather than the passenger side to retain visibility',
      'Share active ride link or trigger HerShield 15-minute live location',
      'Utilize HerShield Fake Call if a conversation becomes invasive'
    ],
    fullGuide: 'When using ride-hailing services, make it a steadfast rule never to get in until the driver verbally confirms your name first. If you feel uneasy, speak aloud on the phone or trigger a scheduled fake call stating that your arrival is monitored by family waiting outside.',
    author: 'Transit Safety Specialist Laura Gomez',
    iconName: 'Car'
  },
  {
    id: 'art-4',
    category: 'Workplace Safety',
    title: 'Establishing Boundaries & Documenting Inappropriate Behavior',
    readTime: '5 min read',
    summary: 'A structured legal and organizational framework to handle harassment, gaslighting, or boundary violations at work.',
    keySteps: [
      'Keep an external, off-work-network chronological log of incidents',
      'Save exact dates, times, witnesses, and direct quotes',
      'Communicate clear, unequivocal written boundaries via email',
      'Consult confidential legal aid resources prior to HR confrontation if retaliation is feared'
    ],
    fullGuide: 'Harassment thrives on isolation and ambiguity. Documenting interactions immediately in a secure private log gives you evidentiary integrity if administrative or legal intervention becomes necessary.',
    author: 'Employment Attorney Rachel Ward',
    iconName: 'Briefcase'
  },
  {
    id: 'art-5',
    category: 'Public Transport Safety',
    title: 'Night Transit Survival: Positioning & Escape Routes',
    readTime: '4 min read',
    summary: 'Where to sit on trains, buses, and subway platforms to minimize vulnerability during off-peak hours.',
    keySteps: [
      'Sit close to the vehicle operator or conductor cabin',
      'Stand near the emergency alarm levers on subway platforms',
      'Keep one ear free when wearing headphones in stations',
      'Avoid empty train cars; switch cars at the next platform if someone follows you'
    ],
    fullGuide: 'The psychology of spatial awareness shows that staying within immediate sightline of public operators drastically reduces opportunistic crimes. Keep your posture confident, eyes scanning exits, and phone accessible in your dominant hand.',
    author: 'Metro Transit Advisor Sarah Mitchell',
    iconName: 'Train'
  },
  {
    id: 'art-6',
    category: 'Self-Protection Awareness',
    title: 'De-escalation Tactics & Situational Intuition',
    readTime: '5 min read',
    summary: 'Learning to trust early gut warnings, creating physical buffer space, and disengaging safely without escalating.',
    keySteps: [
      'Honor your instinctive physiological alarms immediately without second-guessing',
      'Maintain a minimum 6-foot reactionary barrier with aggressive individuals',
      'Use assertive verbal deflections with palms forward at chest height',
      'Move toward illuminated commercial zones rather than isolated alleys'
    ],
    fullGuide: 'Your nervous system often notices micro-threats before your conscious mind processes them. If someone makes you uncomfortable, prioritize your safety over social politeness. Crossing the street or entering a convenience store is always the correct choice.',
    author: 'Self-Defense Instructor Maya Patel',
    iconName: 'AlertCircle'
  },
  {
    id: 'art-7',
    category: 'Relationship Safety',
    title: 'Recognizing Coercive Control & Covert Red Flags',
    readTime: '7 min read',
    summary: 'Understanding subtle control tactics, digital monitoring, isolation patterns, and confidential escape planning.',
    keySteps: [
      'Watch for gradual alienation from your lifelong friends and family',
      'Beware of demands for device passwords disguised as "transparency"',
      'Establish a hidden safety bag and duplicate emergency documentation',
      'Contact confidential hotlines from secure borrowed devices'
    ],
    fullGuide: 'Coercive control often masquerades as intense concern or romantic devotion. If an intimate partner dictates your wardrobe, monitors your mileage, or manages your finances without consent, seek confidential guidance with trained advocates.',
    author: 'Clinical Psychologist Dr. Rebecca Thorne',
    iconName: 'HeartHandshake'
  },
  {
    id: 'art-8',
    category: 'Financial Safety',
    title: 'Economic Independence & Securing Private Reserves',
    readTime: '4 min read',
    summary: 'Protecting your individual credit, maintaining discreet emergency reserves, and guarding bank access.',
    keySteps: [
      'Maintain an individual bank account at an institution separate from joint accounts',
      'Freeze credit reports to prevent fraudulent loans or unauthorized lines',
      'Store digital scans of passports, social security, and titles in encrypted storage',
      'Keep a modest cash contingency reserve in a secure location'
    ],
    fullGuide: 'Financial security provides the mobility to leave dangerous or abusive environments. Ensure banking credentials have unique biometrics and paperless notifications directed to a private email address.',
    author: 'Financial Wellness Advocate Sophia Ortiz',
    iconName: 'Wallet'
  }
];

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'rep-1',
    type: 'Harassment',
    date: '2026-09-08',
    time: '21:30',
    location: '5th Ave & Pine St Metro Station',
    description: 'Repeated verbal catcalling and following for two blocks until entering a 24-hour pharmacy.',
    isAnonymous: true,
    status: 'under_review',
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    shareWithCommunity: true
  },
  {
    id: 'rep-2',
    type: 'Unsafe location',
    date: '2026-09-05',
    time: '23:15',
    location: 'Oakwood Park East Trail',
    description: 'Four consecutive streetlights out and no security presence; isolated pedestrian corridor.',
    isAnonymous: false,
    status: 'submitted',
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    shareWithCommunity: true
  }
];

export const FAQS = [
  {
    question: 'What is HerShield?',
    answer: 'HerShield is an advanced personal security platform designed to empower women with instant emergency SOS activation, trusted contact escalation, user-controlled live location sharing, safe route intelligence, fake calls for uncomfortable situations, and verified nearby emergency resources.'
  },
  {
    question: 'How does the Emergency SOS work?',
    answer: 'HerShield uses a deliberate press-and-hold interaction (or confirmation countdown) to prevent accidental triggers. When activated, your selected trusted contacts immediately receive your emergency alert along with your real-time coordinates, battery level, and an urgent assistance notification.'
  },
  {
    question: 'Who receives my emergency alert?',
    answer: 'Only the specific trusted contacts you have chosen and configured in your personal safety network. You can mark specific contacts as Primary Emergency Contacts and customize alert permissions for each individual.'
  },
  {
    question: 'Can I control location sharing?',
    answer: 'Yes, 100%. Location sharing is entirely user-controlled. You can initiate sharing for a set duration (e.g. 15 minutes, 1 hour) or until you manually stop it. You choose precisely which trusted contacts can view your location, and you can revoke access with a single tap at any second.'
  },
  {
    question: 'Can I add, edit, or remove trusted contacts at any time?',
    answer: 'Absolutely. You have complete authority over your safety circle. You can add new contacts, modify their relationships, toggle them on or off, test emergency alerts with them, or delete them instantly from your dashboard.'
  },
  {
    question: 'Is my personal information and location private?',
    answer: 'Yes. HerShield operates on a privacy-first architecture with minimal data retention. We never sell your personal data, track your location continuously in the background without explicit permission, or publicly expose incident reports without strict anonymization.'
  },
  {
    question: 'Does HerShield replace official emergency services?',
    answer: 'No. HerShield is an auxiliary safety companion and notification tool designed to alert your trusted personal circle and help you navigate safely. If you are in immediate life-threatening danger, always dial your local emergency services (e.g., 911 in North America, 112 in Europe, 999 in the UK) directly.'
  },
  {
    question: 'Can I use HerShield while travelling?',
    answer: 'Yes. HerShield works wherever you have internet or cellular connectivity. The Find Help tool dynamically identifies emergency hotlines, medical centers, and consular/police aid based on your current region.'
  }
];

export const TESTIMONIALS = [
  {
    quote: "HerShield gives me tremendous peace of mind during late-night commutes home from the hospital. The Fake Call feature effortlessly helped me step away from an aggressive stranger without confrontation.",
    author: "Dr. Chloe Vance",
    role: "Emergency Medicine Resident",
    tag: "Verified User",
    avatar: "CV"
  },
  {
    quote: "The live location sharing timer is brilliant. My sister and I share our routes whenever we jog after sunset. When I reach home, it automatically ends without constant back-and-forth texting.",
    author: "Amara Okonjo",
    role: "Architect & Marathon Runner",
    tag: "Verified User",
    avatar: "AO"
  },
  {
    quote: "As someone who travels solo frequently for business, having instant access to verified local shelters, hospitals, and one-tap trusted contact alerts makes this an indispensable app on my home screen.",
    author: "Sofia Takahashi",
    role: "Global Design Director",
    tag: "Verified User",
    avatar: "ST"
  }
];
