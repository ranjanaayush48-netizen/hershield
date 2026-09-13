import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { 
  PhoneCall, 
  Clock, 
  User, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  AlertCircle,
  PhoneOff,
  Shield,
  MessageSquare
} from 'lucide-react';

export const FakeCallPage: React.FC = () => {
  const { fakeCallState, scheduleFakeCall, cancelFakeCall, triggerInstantFakeCall } = useSafety();

  const [callerName, setCallerName] = useState('Mom');
  const [callerNumber, setCallerNumber] = useState('+1 (555) 019-2834');
  const [delaySeconds, setDelaySeconds] = useState(5);

  const presets = [
    { name: 'Mom', number: '+1 (555) 019-2834', reason: 'Family check-in' },
    { name: 'Boss (David K.)', number: '+1 (555) 832-1100', reason: 'Urgent project escalation' },
    { name: 'Roommate (Sarah)', number: '+1 (555) 941-0021', reason: 'Apartment keys emergency' },
    { name: 'Uber Driver', number: '+1 (555) 321-4490', reason: 'Car arrived outside' }
  ];

  const handleSelectPreset = (p: { name: string; number: string }) => {
    setCallerName(p.name);
    setCallerNumber(p.number);
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleFakeCall(callerName, callerNumber, delaySeconds);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
            Discreet Exit Strategy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Fake Call Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1">
            Simulate an urgent incoming telephone call to politely and safely excuse yourself from uncomfortable interactions.
          </p>
        </div>

        {fakeCallState.status === 'scheduled' && (
          <div className="flex items-center gap-2 bg-pink-500/15 border border-pink-500/30 px-3 py-1.5 rounded-xl text-xs text-pink-300">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span>Scheduled in {fakeCallState.delaySeconds}s</span>
            <button
              onClick={cancelFakeCall}
              className="ml-2 text-white hover:underline text-[11px] font-bold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Quick Setup Card */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-6">
        
        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#B8B5C9] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Quick Caller Personas:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  callerName === p.name
                    ? 'bg-pink-500/15 border-pink-400 text-white shadow-md'
                    : 'bg-[#0B1020] border-[#30263D] text-[#B8B5C9] hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block truncate">{p.name}</span>
                <span className="text-[10px] opacity-70 block truncate mt-0.5">{p.reason}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSchedule} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B8B5C9]">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="e.g. Mom or Dave"
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-pink-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B8B5C9]">Phone Number (Optional)</label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={callerNumber}
                  onChange={(e) => setCallerNumber(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-pink-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Delay Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#B8B5C9] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2DD4BF]" />
              Schedule Delay Window:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { sec: 5, label: '5 Seconds', desc: 'Instant disengagement' },
                { sec: 15, label: '15 Seconds', desc: 'Walk to elevator' },
                { sec: 30, label: '30 Seconds', desc: 'Prepare conversation exit' },
                { sec: 60, label: '1 Minute', desc: 'Finish conversation' }
              ].map((d) => (
                <button
                  key={d.sec}
                  type="button"
                  onClick={() => setDelaySeconds(d.sec)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    delaySeconds === d.sec
                      ? 'bg-teal-500/15 border-[#2DD4BF] text-white shadow-md'
                      : 'bg-[#0B1020] border-[#30263D] text-[#B8B5C9] hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{d.label}</span>
                  <span className="text-[10px] opacity-70 block mt-0.5">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-lg font-bold text-xs text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Schedule Call in {delaySeconds}s</span>
            </button>

            <button
              type="button"
              onClick={triggerInstantFakeCall}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs text-[#B8B5C9] hover:text-white bg-[#0B1020] hover:bg-[#131b31] border border-[#30263D] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-pink-400" />
              <span>Trigger Instantly (Right Now)</span>
            </button>
          </div>
        </form>

      </div>

      {/* Suggested Dialogue Scripts to excuse yourself */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#A78BFA]" />
          Recommended Conversational Exit Phrases
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D] text-[#B8B5C9]">
            <span className="text-white font-semibold block mb-1">For rideshares / transit:</span>
            "Hey Mom, yeah I'm just pulling up to the corner right now. I see you waiting outside."
          </div>

          <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D] text-[#B8B5C9]">
            <span className="text-white font-semibold block mb-1">For awkward social/date encounters:</span>
            "I'm so sorry, my roommate is locked out in the cold with groceries, I have to run immediately."
          </div>
        </div>
      </div>

    </div>
  );
};
