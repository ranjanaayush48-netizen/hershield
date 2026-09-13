import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, ShieldAlert, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase font-bold text-[#A78BFA] tracking-wider">
            Clear Answers
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#B8B5C9] max-w-xl mx-auto leading-relaxed">
            Essential guidelines regarding HerShield operation, privacy protection, and emergency escalation.
          </p>
        </div>

        {/* Advisory Banner */}
        <div className="bg-[#1A1028] border border-[#FF6B6B]/40 rounded-2xl p-5 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-[#FF6B6B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#B8B5C9] space-y-1">
            <h4 className="font-bold text-white text-sm">Critical Notice on Emergency Services</h4>
            <p className="leading-relaxed">
              HerShield is a peer-to-peer personal security and notification companion. It <strong className="text-white">does not replace official emergency dispatch (911, 112, 999)</strong>. If you are experiencing an immediate threat to life or limb, always contact official law enforcement and emergency medical authorities directly.
            </p>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#1A1028] border border-[#30263D] rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-base hover:text-[#A78BFA] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#A78BFA] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#B8B5C9] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#B8B5C9] leading-relaxed border-t border-[#30263D]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Have additional safety inquiries?</h3>
          <p className="text-xs text-[#B8B5C9] max-w-md mx-auto">
            Our safety operations team is available to help clarify features, data policies, or organizational deployment.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
