import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Heart, Lock, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080C18] border-t border-[#30263D] text-[#B8B5C9] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#30263D]">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F43F6F] flex items-center justify-center text-white shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Her<span className="text-[#F43F6F]">Shield</span>
              </span>
            </Link>
            
            <p className="text-sm text-[#B8B5C9] max-w-md leading-relaxed">
              Technology designed to help you feel safer, more prepared, and more connected.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#B8B5C9]/80 pt-2">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Privacy-First Architecture
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#A78BFA]" />
                Universal Access
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">Safety Resources</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About HerShield</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Privacy & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#F43F6F] hover:underline font-medium">Safety Dashboard</Link>
              </li>
              <li>
                <Link to="/sos" className="text-[#FF6B6B] hover:underline font-medium">Emergency SOS</Link>
              </li>
              <li>
                <Link to="/find-help" className="text-[#2DD4BF] hover:underline font-medium">Find Nearby Help</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Emergency Disclaimer Banner */}
        <div className="mt-8 bg-[#1A1028] border border-[#30263D] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/15 text-[#FF6B6B] shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Emergency Disclaimer</h5>
              <p className="text-xs text-[#B8B5C9] mt-0.5 leading-relaxed">
                In an immediate emergency, contact your local emergency services. HerShield is a personal support companion tool and does not replace official municipal 911/112 law enforcement dispatch.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <a
              href="tel:911"
              className="px-4 py-2 rounded-xl bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30 border border-[#FF6B6B]/40 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              Call 911 / 112
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8B5C9]/70">
          <div>
            © {new Date().getFullYear()} HerShield Safety Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with precision for personal security & empowerment</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
