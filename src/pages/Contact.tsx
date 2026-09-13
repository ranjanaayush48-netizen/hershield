import React, { useState } from 'react';
import { Mail, MessageSquare, Shield, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const Contact: React.FC = () => {
  const { addNotification } = useSafety();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feedback & Suggestions');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    addNotification('Message Received', 'Thank you for reaching out to the HerShield team.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase font-bold text-[#F43F6F] tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact HerShield Team
          </h1>
          <p className="text-base text-[#B8B5C9] max-w-xl mx-auto leading-relaxed">
            Have questions, feedback, partnership inquiries, or community suggestions? We are here to listen.
          </p>
        </div>

        {/* Emergency Notice */}
        <div className="bg-[#1A1028] border border-[#FF6B6B]/40 rounded-2xl p-4 text-xs text-[#B8B5C9] flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-[#FF6B6B] shrink-0" />
          <span>
            <strong className="text-white">Emergency Warning:</strong> This contact form is NOT monitored for real-time emergency distress. If you require urgent assistance, dial your local emergency services (911/112) immediately.
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-10">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Message Dispatched</h3>
              <p className="text-sm text-[#B8B5C9] max-w-md mx-auto">
                Thank you for contacting HerShield. Our security support team will review your inquiry and follow up within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#B8B5C9] block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Sophia Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#B8B5C9]/50 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#B8B5C9] block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sophia@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#B8B5C9]/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#B8B5C9] block">Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-3 text-sm text-white outline-none"
                >
                  <option>Feedback & Feature Request</option>
                  <option>Bug Report / Technical Issue</option>
                  <option>University / Campus Integration</option>
                  <option>NGO / Domestic Crisis Partner</option>
                  <option>Media & Privacy Questions</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#B8B5C9] block">Message Details</label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can our security team assist you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl p-4 text-sm text-white placeholder:text-[#B8B5C9]/50 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm text-sm transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
