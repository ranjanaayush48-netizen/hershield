import React from 'react';
import { Shield, Lock, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-[#2DD4BF] tracking-wider">
            Data Protection Charter
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#B8B5C9]">
            Last updated: September 2026 • Effective immediately across all HerShield services
          </p>
        </div>

        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-10 space-y-8 text-sm text-[#B8B5C9] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2DD4BF]" />
              1. Our Core Privacy Philosophy
            </h2>
            <p>
              HerShield is engineered from the ground up on the principle of minimal data collection. We believe personal security technology must never create dangerous digital vulnerabilities for the user. We do not sell, rent, monetize, or broker your personal data to commercial advertisers or data aggregators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#F43F6F]" />
              2. User-Controlled Location Telemetry
            </h2>
            <p>
              Your geographical coordinates are strictly retrieved on an explicit, opt-in basis. HerShield DOES NOT track your location continuously in the background when the application is idle. Location tracking occurs solely under two deliberate conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>When you manually launch a Live Location Sharing session with an explicit duration timer.</li>
              <li>When you activate the Emergency SOS broadcast sequence.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#A78BFA]" />
              3. Incident Documentation & Discretion
            </h2>
            <p>
              Any reports logged inside the Incident Reporting module are encrypted. If you designate a report as anonymous, all user account identifiers are scrubbed from community risk mapping datasets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Trusted Contacts Confidentiality</h2>
            <p>
              Telephone numbers and contact records entered into your safety circle are stored securely and used exclusively to dispatch emergency SMS and location alerts upon your command.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Data Retention & Instant Deletion</h2>
            <p>
              You maintain complete ownership of your data. You may delete your account, wipe all incident logs, and revoke contact linkages at any time from the Settings dashboard.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
