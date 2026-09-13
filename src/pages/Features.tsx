import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  Navigation, 
  PhoneCall, 
  LifeBuoy, 
  Activity, 
  FileWarning, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  MapPin,
  BellRing
} from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      id: 'sos',
      title: 'One-Tap Emergency SOS',
      tagline: 'Intentional 2-second hold to broadcast emergency alerts instantly.',
      icon: ShieldAlert,
      color: 'text-[#FF6B6B]',
      bg: 'bg-rose-500/15',
      route: '/sos',
      points: [
        'Multi-channel simulated SMS & webhook dispatch with exact GPS coordinates',
        'Optional gentle synthesizer siren with sound toggle',
        'PIN-verified cancellation to prevent coerced termination',
        'Automatic 1-hour live location activation on trigger'
      ]
    },
    {
      id: 'contacts',
      title: 'Granular Trusted Contacts Circle',
      tagline: 'Empower friends and family with clear roles in your emergency network.',
      icon: Users,
      color: 'text-[#A78BFA]',
      bg: 'bg-purple-500/15',
      route: '/contacts',
      points: [
        'Organize Primary Emergency Responders vs Casual Check-in buddies',
        'Test Alert simulator to verify SMS readiness with loved ones',
        'Toggle individual contacts active/inactive with one click',
        'Masked telephone numbers for enhanced local privacy'
      ]
    },
    {
      id: 'location',
      title: 'User-Controlled Live Location Sharing',
      tagline: 'Zero background spying. You decide when and how long you are tracked.',
      icon: Navigation,
      color: 'text-[#2DD4BF]',
      bg: 'bg-teal-500/15',
      route: '/location',
      points: [
        'Preset duration timers: 15 minutes, 1 hour, or continuous until stopped',
        'Select specific recipients instead of broadcasting to your whole circle',
        'Interactive map preview with accuracy radius and address readout',
        'Automatic auto-expiration with gentle reminder alert'
      ]
    },
    {
      id: 'fake-call',
      title: 'Discreet Fake Call Escort',
      tagline: 'Tactful exit strategy when feeling cornered or pressured in public.',
      icon: PhoneCall,
      color: 'text-pink-400',
      bg: 'bg-pink-500/15',
      route: '/fake-call',
      points: [
        'Customizable caller profiles (e.g. "Mom", "Roommate", "Uber Driver")',
        'Scheduled delay timer (5s, 15s, 30s, 1m) to plan your disengagement',
        'Realistic phone ringing audio with vibration and incoming call screen',
        'In-call timer with suggested conversational escape scripts'
      ]
    },
    {
      id: 'find-help',
      title: 'Verified Nearby Help & Sanctuaries',
      tagline: 'Instantly pinpoint the closest open shelter, hospital, or police desk.',
      icon: LifeBuoy,
      color: 'text-[#2DD4BF]',
      bg: 'bg-teal-500/15',
      route: '/find-help',
      points: [
        'Category filters: Police, Hospitals, Ambulances, Hotlines, Shelters, Legal',
        'Real-time open status indicator and verified hours',
        'One-touch direct telephone dialing and mapped walking directions',
        'Curated 24/7 women crisis hotlines with toll-free reach'
      ]
    },
    {
      id: 'safe-route',
      title: 'Safe Route & Security Check',
      tagline: 'Evaluate routes based on lighting, open commerce, and police density.',
      icon: Activity,
      color: 'text-[#A78BFA]',
      bg: 'bg-purple-500/15',
      route: '/safe-route',
      points: [
        'Intelligent Safety Score (0-100) calculated from multiple urban factors',
        'Breakdowns of well-lit thoroughfares vs dark alleys',
        'Highlights 24-hour convenience stores and public safe havens',
        'Suggested walking alternatives that prioritize safety over distance'
      ]
    },
    {
      id: 'report',
      title: 'Encrypted Incident Reporting',
      tagline: 'Secure, private incident logging to document harassment or threats.',
      icon: FileWarning,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
      route: '/report',
      points: [
        'Categorized reports: Harassment, Stalking, Threat, Unsafe Spot, Other',
        'Optional anonymous filing mode that masks your identity',
        'Date, exact time, location, and photo/evidence upload support',
        'Confidential storage kept safe from unauthorized third parties'
      ]
    },
    {
      id: 'resources',
      title: 'Tactical Safety Knowledge Hub',
      tagline: 'Expert-backed practical guides for digital, travel, and personal security.',
      icon: Shield,
      color: 'text-[#F43F6F]',
      bg: 'bg-rose-500/15',
      route: '/resources',
      points: [
        '8 curated categories from anti-stalking to ride-share safety checklists',
        'Actionable bullet points for high-stress mental clarity',
        'Written in consultation with security and advocacy specialists',
        'Offline-friendly access directly inside your web app'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-bold text-[#F43F6F] tracking-wider">
            Features & Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Security Tools Built for Confidence and Real Protection
          </h1>
          <p className="text-base sm:text-lg text-[#B8B5C9] leading-relaxed">
            Every feature in HerShield has been engineered to minimize reaction time, avoid accidental triggers, and empower you with immediate support.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureList.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-8 flex flex-col justify-between space-y-6 hover:border-[#A78BFA]/50 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Link
                      to={f.route}
                      className="text-xs font-semibold text-[#A78BFA] hover:text-white flex items-center gap-1"
                    >
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{f.title}</h3>
                    <p className="text-sm text-[#B8B5C9] mt-1">{f.tagline}</p>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-[#30263D]">
                    {f.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#B8B5C9] leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    to={f.route}
                    className="w-full py-2.5 rounded-xl bg-[#0B1020] hover:bg-[#121930] border border-[#30263D] text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Open {f.title} Demo</span>
                    <ArrowRight className="w-3 h-3 text-[#A78BFA]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to explore the interactive safety tools?
          </h2>
          <p className="text-sm text-[#B8B5C9] max-w-xl mx-auto">
            Test the live location sharing, try a simulated fake call, or configure your trusted circle right now.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg bg-[#F43F6F] hover:bg-[#e03360] text-white font-bold text-sm shadow-sm transition-colors"
            >
              Open Safety Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
