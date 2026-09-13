import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const DemoDisclaimerBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#1A1028] border-b border-[#30263D] text-xs text-[#B8B5C9] px-4 py-2 flex items-center justify-between gap-3 relative z-40">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <ShieldAlert className="w-4 h-4 text-[#F43F6F] shrink-0" />
        <span className="leading-tight">
          <strong className="text-white font-medium">Emergency Notice:</strong> HerShield is an auxiliary safety app prototype and does not replace official emergency services. In an immediate emergency, always dial <strong className="text-white underline">911</strong>, <strong className="text-white underline">112</strong>, or your local emergency dispatch.
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-[#B8B5C9] hover:text-white p-1 transition-colors rounded shrink-0"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
