import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import { 
  Shield, 
  ShieldAlert, 
  Users, 
  Navigation, 
  PhoneCall, 
  LifeBuoy, 
  FileWarning, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  EyeOff, 
  Sparkles,
  ChevronDown,
  Activity,
  MapPin,
  Clock,
  Battery,
  AlertCircle
} from 'lucide-react';
import { FAQS, TESTIMONIALS } from '../data/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isSosActive, 
    setQuickSosModalOpen, 
    contacts, 
    locationSession, 
    confirmSosActivation 
  } = useSafety();

  // Press & hold state for Hero & SOS section
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const startHold = () => {
    setIsHolding(true);
    const start = Date.now();
    const duration = 2000;

    holdTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(pct);

      if (pct >= 100) {
        clearInterval(holdTimerRef.current!);
        holdTimerRef.current = null;
        setIsHolding(false);
        setHoldProgress(0);
        confirmSosActivation();
        navigate('/sos');
      }
    }, 40);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      
      {/* ================================================== */}
      {/* 1. HERO SECTION */}
      {/* ================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-[#30263D]">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1A1028] border border-[#30263D] text-xs text-[#B8B5C9]">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                <span className="font-semibold text-white">Personal Security Platform</span>
                <span className="text-[#30263D]">|</span>
                <span className="text-[#B8B5C9]">Safety First</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                  Your Safety. <br />
                  <span className="text-[#F43F6F]">
                    One Tap Away.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-[#B8B5C9] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  HerShield helps you stay connected, prepared, and protected with instant emergency assistance, trusted contacts, location sharing, and essential safety tools.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm flex items-center justify-center gap-2 text-base transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/features"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-lg font-semibold text-white bg-[#1A1028] hover:bg-[#231737] border border-[#30263D] flex items-center justify-center gap-2 text-base transition-colors"
                >
                  <span>Explore Safety Tools</span>
                </Link>
              </div>

              {/* Trust Statement */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-[#B8B5C9]">
                <Shield className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                <span>Designed for faster access to help when it matters most.</span>
              </div>
            </div>

            {/* Right: Modern Visual Safety Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[360px] bg-[#1A1028] rounded-xl border border-[#30263D] p-5 shadow-2xl shadow-black/80 space-y-4">
                
                {/* Phone Notch & Header */}
                <div className="flex items-center justify-between text-xs text-[#B8B5C9] pb-2 border-b border-[#30263D]/60">
                  <span className="font-mono text-white text-[11px]">9:41 AM</span>
                  <div className="w-16 h-4 bg-black/40 rounded-full mx-auto" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#2DD4BF]">5G</span>
                    <Battery className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                </div>

                {/* Safety Status Card inside Mockup */}
                <div className="bg-[#0B1020] rounded-2xl p-4 border border-[#30263D] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF] safe-ring-animation" />
                    <div>
                      <div className="text-sm font-bold text-white">You're Safe</div>
                      <div className="text-[11px] text-[#B8B5C9]">Safety circle active & standby</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#2DD4BF] bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                    Protected
                  </span>
                </div>

                {/* SOS Button inside Mockup */}
                <div className="bg-[#1A1028] rounded-xl p-5 border border-[#30263D] text-center space-y-3">
                  <div className="text-xs text-[#B8B5C9] font-medium">Emergency Broadcast</div>
                  
                  <button
                    onClick={() => setQuickSosModalOpen(true)}
                    className="w-24 h-24 mx-auto rounded-full bg-[#F43F6F] hover:bg-[#e03360] text-white flex flex-col items-center justify-center shadow-lg shadow-rose-950/40 sos-ring-animation transition-transform active:scale-95 cursor-pointer"
                  >
                    <ShieldAlert className="w-7 h-7" />
                    <span className="text-xs font-bold tracking-wider uppercase mt-1">SOS</span>
                  </button>

                  <p className="text-[11px] text-[#B8B5C9]/80">
                    Tap to preview alert workflow
                  </p>
                </div>

                {/* Quick Info Badges inside Mockup */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#0B1020] rounded-xl p-2.5 border border-[#30263D]">
                    <span className="text-[10px] text-[#B8B5C9] flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#A78BFA]" />
                      Trusted Circle
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">3 Contacts Ready</span>
                  </div>

                  <div className="bg-[#0B1020] rounded-xl p-2.5 border border-[#30263D]">
                    <span className="text-[10px] text-[#B8B5C9] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#2DD4BF]" />
                      Location
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5 truncate">Downtown SF</span>
                  </div>
                </div>

                {/* Simulated Emergency Resources list snippet */}
                <div className="bg-[#0B1020] rounded-xl p-3 border border-[#30263D] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-[#F43F6F]" />
                    <div>
                      <span className="font-semibold text-white block">Nearest Safe Sanctuary</span>
                      <span className="text-[10px] text-[#B8B5C9]">Central Metro Precinct (0.8 mi)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#2DD4BF] font-mono">24/7 Open</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 2. EMERGENCY SOS INTERACTIVE SECTION */}
      {/* ================================================== */}
      <section className="py-20 bg-[#0E1326] border-b border-[#30263D] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/15 text-[#FF6B6B] border border-rose-500/30">
              Immediate Assistance Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Emergency SOS
            </h2>
            <p className="text-[#B8B5C9] text-base sm:text-lg max-w-xl mx-auto">
              Quickly alert your trusted contacts when you feel unsafe. Designed with intentional hold activation to prevent false alarms.
            </p>
          </div>

          {/* SOS Circular Hold Button */}
          <div className="py-6 flex flex-col items-center">
            <div className="relative">
              <button
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center text-white select-none transition-transform duration-200 cursor-pointer ${
                  isHolding ? 'scale-95' : 'hover:scale-105'
                } bg-[#F43F6F] shadow-xl shadow-rose-950/60 sos-ring-animation`}
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="44%"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="44%"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="600"
                    strokeDashoffset={600 - (600 * holdProgress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>

                <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                  <ShieldAlert className="w-10 h-10 mb-2" />
                  <span className="text-base sm:text-lg font-black tracking-wider uppercase">
                    {isHolding ? `${holdProgress}%` : 'HOLD TO'}
                  </span>
                  <span className="text-xs font-semibold text-rose-100 tracking-wider">
                    {isHolding ? 'HOLDING...' : 'ACTIVATE SOS'}
                  </span>
                </div>
              </button>
            </div>

            <p className="text-xs text-[#B8B5C9] mt-4">
              Hold for 2 seconds to initiate confirmation & emergency dispatch broadcast
            </p>

            {/* Test alert trigger link */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setQuickSosModalOpen(true)}
                className="text-xs font-semibold text-[#A78BFA] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Open Interactive SOS Preview Modal
              </button>
            </div>
          </div>

          {/* What happens on SOS list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6">
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-[#FF6B6B] flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Instant SMS Broadcast</h4>
              <p className="text-xs text-[#B8B5C9] mt-1">
                Your emergency message is sent to all selected contacts with your exact coordinates.
              </p>
            </div>

            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center mb-2">
                <Navigation className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Live Tracking Link</h4>
              <p className="text-xs text-[#B8B5C9] mt-1">
                Automatically activates real-time GPS sharing so trusted friends see your movement.
              </p>
            </div>

            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-[#A78BFA] flex items-center justify-center mb-2">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">PIN-Protected Cancel</h4>
              <p className="text-xs text-[#B8B5C9] mt-1">
                Prevents coerced deactivation by requiring your 4-digit security PIN to mark safe.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 3. HOW IT WORKS */}
      {/* ================================================== */}
      <section className="py-20 border-b border-[#30263D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold text-[#A78BFA] tracking-wider">
              Simple & Rapid Setup
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How HerShield Works
            </h2>
            <p className="text-sm sm:text-base text-[#B8B5C9]">
              Three straightforward steps to establish an impenetrable personal safety network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-8 space-y-4 hover:border-[#A78BFA]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-mono font-extrabold text-[#F43F6F]">01</span>
                <div className="p-3 rounded-xl bg-rose-500/15 text-[#F43F6F]">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Set Up Your Safety Network</h3>
              <p className="text-sm text-[#B8B5C9] leading-relaxed">
                Add trusted contacts (family, partners, close friends) and configure your emergency PIN, notification preferences, and safe boundaries.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-8 space-y-4 hover:border-[#A78BFA]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-mono font-extrabold text-[#A78BFA]">02</span>
                <div className="p-3 rounded-xl bg-purple-500/15 text-[#A78BFA]">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Use Safety Tools</h3>
              <p className="text-sm text-[#B8B5C9] leading-relaxed">
                Access SOS, timed location sharing, realistic fake calls to excuse yourself from uncomfortable situations, and safe route intelligence.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-8 space-y-4 hover:border-[#A78BFA]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-mono font-extrabold text-[#2DD4BF]">03</span>
                <div className="p-3 rounded-xl bg-teal-500/15 text-[#2DD4BF]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Stay Connected</h3>
              <p className="text-sm text-[#B8B5C9] leading-relaxed">
                Your trusted contacts receive real-time notifications with coordinates if you need help, and nearby verified emergency resources are just one tap away.
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              <span>Learn more about the technical architecture</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 4. FEATURES SECTION */}
      {/* ================================================== */}
      <section className="py-20 bg-[#0E1326] border-b border-[#30263D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold text-[#F43F6F] tracking-wider">
              Comprehensive Security Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful Features Engineered for Real Situations
            </h2>
            <p className="text-sm sm:text-base text-[#B8B5C9]">
              Every tool is meticulously designed for high-stress scenarios with high-contrast UI and zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* One-Tap SOS */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-rose-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-[#FF6B6B] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">One-Tap SOS</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Hold-to-activate emergency protocol that immediately sends customized distress text and GPS links.
              </p>
              <Link to="/sos" className="text-xs font-semibold text-[#FF6B6B] hover:underline inline-block pt-1">
                Try SOS Demo →
              </Link>
            </div>

            {/* Trusted Contacts */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-[#A78BFA] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Trusted Contacts</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Organize primary emergency responders, test mock alerts, and manage granular notification rules.
              </p>
              <Link to="/contacts" className="text-xs font-semibold text-[#A78BFA] hover:underline inline-block pt-1">
                Manage Contacts →
              </Link>
            </div>

            {/* Location Sharing */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-teal-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Location Sharing</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                100% user-controlled live tracking. Share for 15 mins, 1 hour, or until manually cancelled.
              </p>
              <Link to="/location" className="text-xs font-semibold text-[#2DD4BF] hover:underline inline-block pt-1">
                Share Location →
              </Link>
            </div>

            {/* Fake Call */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-pink-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Fake Call</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Schedule a realistic phone call from 'Mom' or 'Boss' with customizable delay to excuse yourself discreetly.
              </p>
              <Link to="/fake-call" className="text-xs font-semibold text-pink-400 hover:underline inline-block pt-1">
                Schedule Call →
              </Link>
            </div>

            {/* Nearby Help */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-teal-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Nearby Help</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Instant directory of 24/7 verified police precincts, trauma hospitals, shelters, and legal aid clinics.
              </p>
              <Link to="/find-help" className="text-xs font-semibold text-[#2DD4BF] hover:underline inline-block pt-1">
                Find Resources →
              </Link>
            </div>

            {/* Safety Check & Safe Route */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-[#A78BFA] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Safety Check</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Evaluate walking and transit routes with intelligent lighting, public activity, and proximity scores.
              </p>
              <Link to="/safe-route" className="text-xs font-semibold text-[#A78BFA] hover:underline inline-block pt-1">
                Check Route →
              </Link>
            </div>

            {/* Incident Reporting */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-amber-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileWarning className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Incident Reporting</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Document stalking, harassment, or unsafe conditions in a private, encrypted digital evidence log.
              </p>
              <Link to="/report" className="text-xs font-semibold text-amber-400 hover:underline inline-block pt-1">
                File Report →
              </Link>
            </div>

            {/* Safety Resources */}
            <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3 hover:border-rose-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-[#F43F6F] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Safety Resources</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Curated tactical guides on transit safety, digital privacy, de-escalation, and financial independence.
              </p>
              <Link to="/resources" className="text-xs font-semibold text-[#F43F6F] hover:underline inline-block pt-1">
                Read Guides →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 5. PRIVACY & SECURITY SECTION */}
      {/* ================================================== */}
      <section className="py-20 border-b border-[#30263D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual */}
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-sm bg-[#1A1028] border border-[#30263D] rounded-xl p-6 shadow-2xl space-y-5">
                <div className="w-12 h-12 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#2DD4BF]" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Privacy Guarantee</h4>
                  <p className="text-xs text-[#B8B5C9]">Your real-time coordinates are never sold or weaponized.</p>
                </div>

                <div className="space-y-2.5 pt-2 text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D]">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span className="text-white font-medium">Zero Passive Background Tracking</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D]">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span className="text-white font-medium">Encrypted Contact Storage</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D]">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span className="text-white font-medium">Anonymous Incident Reporting</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B1020] border border-[#30263D]">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span className="text-white font-medium">User-Controlled Sharing Expiry</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
                Strict Data Sovereignty
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Your Safety Should Never Come at the Cost of Your Privacy.
              </h2>
              <p className="text-sm sm:text-base text-[#B8B5C9] leading-relaxed">
                Security technology must earn your absolute trust. Unlike social media check-ins or invasive tracker devices, HerShield enforces zero-monetization data principles:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-[#F43F6F]" />
                    Minimal Data Collection
                  </h4>
                  <p className="text-xs text-[#B8B5C9]">
                    We collect only what is strictly necessary to alert your chosen circle during emergencies.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#2DD4BF]" />
                    User-Controlled Location
                  </h4>
                  <p className="text-xs text-[#B8B5C9]">
                    GPS is exclusively polled when you actively initiate sharing or trigger SOS.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileWarning className="w-4 h-4 text-[#A78BFA]" />
                    Private Reports
                  </h4>
                  <p className="text-xs text-[#B8B5C9]">
                    Incident documentation remains confidential and encrypted under your personal account.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-pink-400" />
                    Clear Permissions
                  </h4>
                  <p className="text-xs text-[#B8B5C9]">
                    Transparent prompts with no buried tracking cookies or third-party ad brokers.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/privacy"
                  className="text-xs font-semibold text-[#2DD4BF] hover:underline flex items-center gap-1.5"
                >
                  <span>Read our complete privacy pledge & technical policies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 6. STATISTICS / PRODUCT CAPABILITIES */}
      {/* ================================================== */}
      <section className="py-16 bg-[#0B1020] border-b border-[#30263D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#F43F6F]">
                24/7
              </div>
              <div className="text-base font-bold text-white">Continuous Safety Access</div>
              <p className="text-xs text-[#B8B5C9]">
                Instant standby across all mobile browsers and touch devices worldwide.
              </p>
            </div>

            <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#A78BFA]">
                1 Tap
              </div>
              <div className="text-base font-bold text-white">Emergency Assistance</div>
              <p className="text-xs text-[#B8B5C9]">
                Zero-friction touch activation with instant multi-contact coordination.
              </p>
            </div>

            <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2DD4BF]">
                100%
              </div>
              <div className="text-base font-bold text-white">User-Controlled Sharing</div>
              <p className="text-xs text-[#B8B5C9]">
                Full autonomy to start, set timers, or revoke location broadcast at any millisecond.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 7. TESTIMONIALS */}
      {/* ================================================== */}
      <section className="py-20 bg-[#0E1326] border-b border-[#30263D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold text-[#A78BFA] tracking-wider">
              Prototype Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Real Everyday Peace of Mind
            </h2>
            <p className="text-xs text-[#B8B5C9]">
              Sample feedback gathered from early security product testers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <p className="text-sm text-[#B8B5C9] leading-relaxed italic">
                  "{t.quote}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-[#30263D]">
                  <div className="w-9 h-9 rounded-lg bg-[#30263D] text-white font-bold text-xs flex items-center justify-center border border-[#453654]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.author}</div>
                    <div className="text-xs text-[#B8B5C9]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 8. FAQ ACCORDION SECTION */}
      {/* ================================================== */}
      <section className="py-20 border-b border-[#30263D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-bold text-[#2DD4BF] tracking-wider">
              Common Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#B8B5C9]">
              Everything you need to know about HerShield protocols and safety features.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#1A1028] border border-[#30263D] rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-base hover:text-[#A78BFA] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#B8B5C9] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#B8B5C9] leading-relaxed border-t border-[#30263D]/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 9. BOTTOM CTA BANNER */}
      {/* ================================================== */}
      <section className="py-16 bg-[#0E1326] border-b border-[#30263D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Take Control of Your Personal Security Today
          </h2>
          <p className="text-sm sm:text-base text-[#B8B5C9] max-w-xl mx-auto leading-relaxed">
            Free to set up, user-controlled, and designed specifically to empower you every day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Access Safety Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg font-semibold text-white bg-white/10 hover:bg-white/15 border border-[#30263D] flex items-center justify-center gap-2 transition-colors"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
