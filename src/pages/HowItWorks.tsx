import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldAlert, 
  Navigation, 
  PhoneCall, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Bell, 
  Radio, 
  ShieldCheck, 
  ChevronRight,
  Smartphone
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-bold text-[#A78BFA] tracking-wider">
            Architecture & Workflow
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            How HerShield Protects You
          </h1>
          <p className="text-base sm:text-lg text-[#B8B5C9] leading-relaxed">
            Engineered with a rapid 3-step lifecycle designed to move seamlessly from peaceful daily commute to instantaneous emergency escalation.
          </p>
        </div>

        {/* 3 Step Interactive Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div 
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer rounded-xl p-8 border transition-all duration-200 ${
              activeStep === 1 
                ? 'bg-[#1A1028] border-[#F43F6F] shadow-xl shadow-rose-950/40 ring-1 ring-[#F43F6F]' 
                : 'bg-[#0E1528] border-[#30263D] hover:border-[#30263D]/80'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-5xl font-mono font-extrabold text-[#F43F6F]">01</span>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-[#F43F6F] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Set Up Your Safety Network</h3>
            <p className="text-sm text-[#B8B5C9] leading-relaxed mb-6">
              Add your trusted contacts and configure your emergency PIN, notification preferences, and safe boundaries.
            </p>

            <ul className="space-y-2 text-xs text-[#B8B5C9]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Select 2–4 designated emergency contacts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Set a secret 4-digit cancellation PIN
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Perform simulated alert tests with loved ones
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => setActiveStep(2)}
            className={`cursor-pointer rounded-xl p-8 border transition-all duration-200 ${
              activeStep === 2 
                ? 'bg-[#1A1028] border-[#A78BFA] shadow-xl shadow-purple-950/40 ring-1 ring-[#A78BFA]' 
                : 'bg-[#0E1528] border-[#30263D] hover:border-[#30263D]/80'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-5xl font-mono font-extrabold text-[#A78BFA]">02</span>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-[#A78BFA] flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Use Safety Tools</h3>
            <p className="text-sm text-[#B8B5C9] leading-relaxed mb-6">
              Access SOS, live location sharing, fake calls, and nearby help whenever navigating uncomfortable environments.
            </p>

            <ul className="space-y-2 text-xs text-[#B8B5C9]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Hold 2s to activate Emergency SOS
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Timed 15m/1h live location sharing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Schedule realistic incoming fake calls
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => setActiveStep(3)}
            className={`cursor-pointer rounded-xl p-8 border transition-all duration-200 ${
              activeStep === 3 
                ? 'bg-[#1A1028] border-[#2DD4BF] shadow-xl shadow-teal-950/40 ring-1 ring-[#2DD4BF]' 
                : 'bg-[#0E1528] border-[#30263D] hover:border-[#30263D]/80'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-5xl font-mono font-extrabold text-[#2DD4BF]">03</span>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-[#2DD4BF] flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Stay Connected</h3>
            <p className="text-sm text-[#B8B5C9] leading-relaxed mb-6">
              Your trusted contacts receive real-time alerts when you need assistance, and you can access 24/7 emergency shelters and clinics.
            </p>

            <ul className="space-y-2 text-xs text-[#B8B5C9]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Automated SMS & live GPS routing map
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Direct 1-tap dial for local trauma centers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Peace-of-mind confirmation when you arrive safe
              </li>
            </ul>
          </div>

        </div>

        {/* Technical Safety Architecture Deep Dive */}
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 sm:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-[#2DD4BF] tracking-wider">
              Fail-Safe Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why Hold-to-Activate Matters in Emergency Ergonomics
            </h2>
            <p className="text-sm text-[#B8B5C9] max-w-2xl leading-relaxed">
              In panic situations, phone screens get accidentally tapped inside purses, pockets, or while jogging. HerShield uses a calibrated 2-second continuous hold interaction combined with an instant 5-second cancel countdown window.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-[#0B1020] border border-[#30263D] rounded-2xl p-5 space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F43F6F]" />
                Zero Accidental Panics
              </div>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Casual taps do not trigger distress alarms. Only a sustained 2,000ms contact or explicit countdown initiates dispatch.
              </p>
            </div>

            <div className="bg-[#0B1020] border border-[#30263D] rounded-2xl p-5 space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#A78BFA]" />
                Coercion-Resistant PIN
              </div>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                If an aggressor forces you to silence your phone, they cannot stop the external broadcast without entering your confidential PIN.
              </p>
            </div>

            <div className="bg-[#0B1020] border border-[#30263D] rounded-2xl p-5 space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#2DD4BF]" />
                Low-Bandwidth Resilient
              </div>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                Transmits lightweight coordinate packets that succeed even in patchy 3G or congested subway tunnels.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#30263D]">
            <span className="text-xs text-[#B8B5C9]">
              Ready to verify your personal circle?
            </span>
            <Link
              to="/contacts"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <span>Manage Trusted Contacts</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
