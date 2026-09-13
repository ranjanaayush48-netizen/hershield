import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Users, Heart, Award, ArrowRight, ShieldAlert } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-bold text-[#F43F6F] tracking-wider">
            Our Mission & Ethics
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Security Technology Built Without Compromise
          </h1>
          <p className="text-base sm:text-lg text-[#B8B5C9] leading-relaxed">
            HerShield was created with a clear objective: to give women and vulnerable individuals intuitive, reliable, and privacy-respecting tools to navigate the physical and digital world safely.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-[#F43F6F] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero Exploitation</h3>
            <p className="text-xs text-[#B8B5C9] leading-relaxed">
              We reject the surveillance capitalism model. Your location telemetry is never packaged, aggregated, or sold to third-party ad exchanges.
            </p>
          </div>

          <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-[#A78BFA] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Ergonomic Precision</h3>
            <p className="text-xs text-[#B8B5C9] leading-relaxed">
              In genuine emergencies, fine-motor coordination drops dramatically. We design high-contrast buttons, large hit targets, and fail-safe confirmation.
            </p>
          </div>

          <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Empowering, Not Fearful</h3>
            <p className="text-xs text-[#B8B5C9] leading-relaxed">
              We design tools that instill autonomy and freedom rather than paranoia. Personal safety is about living life boldly and confidently.
            </p>
          </div>
        </div>

        {/* Narrative */}
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-white">Why HerShield Exists</h2>
          <div className="space-y-4 text-sm text-[#B8B5C9] leading-relaxed">
            <p>
              Traditional safety devices are often clumsy key fobs, noisy plastic whistles, or expensive subscription alarms that demand clunky paired hardware. When individuals find themselves in uncomfortable situations—such as a rideshare vehicle deviating from the course or an aggressive stranger on a subway platform—they need discreet, nuanced tools.
            </p>
            <p>
              HerShield combines low-friction micro-tools: an instant simulated Fake Call to cleanly break conversation, a 15-minute live GPS link to ensure roommates know you arrived safely, and an emergency SOS broadcast that reaches your inner circle in one deliberate tap.
            </p>
          </div>
        </div>

        {/* Emergency Advisory */}
        <div className="bg-[#10172A] border border-[#FF6B6B]/40 rounded-2xl p-6 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-[#FF6B6B] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-[#B8B5C9]">
            <h4 className="text-sm font-bold text-white">Important Emergency Advisory</h4>
            <p className="leading-relaxed">
              HerShield does not act as a replacement for national emergency dispatch services (such as 911, 112, 999, or local municipal emergency hotlines). If you are facing immediate violent peril or a medical emergency, please dial emergency authorities directly.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#F43F6F] hover:bg-[#e03360] text-white font-bold text-sm shadow-sm transition-colors"
          >
            <span>Launch HerShield Suite</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
