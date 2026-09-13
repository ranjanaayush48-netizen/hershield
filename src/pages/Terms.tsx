import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-[#FF6B6B] tracking-wider">
            Legal & Operational Terms
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-[#B8B5C9]">
            Last updated: September 2026 • Please read carefully before using HerShield
          </p>
        </div>

        {/* Highlighted Disclaimer Card */}
        <div className="bg-[#1A1028] border border-[#FF6B6B] rounded-xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3 text-[#FF6B6B]">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">CRITICAL EMERGENCY NOTICE & DISCLAIMER</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#B8B5C9] leading-relaxed">
            HerShield is a digital peer-to-peer auxiliary safety tool and educational application. <strong className="text-white">HerShield does not operate emergency dispatch, police patrol, or medical ambulance services</strong>. In any immediate, life-threatening situation or imminent danger, users must immediately contact their local government emergency telephone number (such as 911, 112, or 999).
          </p>
        </div>

        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-10 space-y-8 text-sm text-[#B8B5C9] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using HerShield web applications, APIs, or safety features, you acknowledge that you have read, understood, and agreed to be bound by these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Scope of Service & Prototype Disclaimers</h2>
            <p>
              Features such as Emergency SOS, Live Location Sharing, Fake Calls, and Safe Route checks are designed to assist personal coordination. They depend on active internet connectivity, browser capabilities, cellular signal, and GPS hardware. HerShield cannot guarantee uninterrupted service in areas of zero connectivity or cellular tower outages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. User Responsibilities & Trusted Contacts</h2>
            <p>
              You are responsible for obtaining prior consent from individuals you add as Trusted Contacts. You agree not to use HerShield to harass, stalk, unlawfully monitor, or send deceptive alerts to non-consenting parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, HerShield and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from emergency outcomes, device failures, or third-party response delays.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
