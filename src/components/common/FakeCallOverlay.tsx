import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Grid, MessageSquare, Clock } from 'lucide-react';

export const FakeCallOverlay: React.FC = () => {
  const {
    isFakeCallRinging,
    isFakeCallActive,
    fakeCallerName,
    fakeCallDuration,
    answerFakeCall,
    endFakeCall
  } = useSafety();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  if (!isFakeCallRinging && !isFakeCallActive) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-sm h-[600px] bg-[#0B1020] rounded-2xl border border-[#30263D] shadow-xl p-6 flex flex-col justify-between overflow-hidden">
        
        {/* Top Status Bar indicator */}
        <div className="flex items-center justify-between text-xs text-[#B8B5C9]/70 pt-2 px-1">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-[#2DD4BF] font-semibold">
            HerShield Call Escort
          </span>
        </div>

        {/* Middle: Caller Info */}
        <div className="flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#1A1028] border-2 border-[#30263D] flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {fakeCallerName.charAt(0)}
              </span>
            </div>
            {isFakeCallRinging && (
              <div className="absolute -inset-2 rounded-full border-2 border-[#2DD4BF] animate-ping pointer-events-none opacity-40" />
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">{fakeCallerName}</h2>
            <p className="text-xs text-[#B8B5C9]">
              {isFakeCallRinging ? 'Incoming Call...' : formatDuration(fakeCallDuration)}
            </p>
          </div>

          {/* Practical conversational escape helper script */}
          {isFakeCallActive && (
            <div className="w-full bg-[#1A1028]/80 border border-[#30263D] rounded-xl p-3 text-left space-y-1.5 mt-2">
              <span className="text-[10px] uppercase font-bold text-[#A78BFA] tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Suggested Escape Script
              </span>
              <p className="text-xs text-white leading-relaxed italic">
                "Hey! Yes, I just stepped out. I see your car across the street — walking over to you right now!"
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action Controls */}
        {isFakeCallRinging ? (
          <div className="flex items-center justify-around pb-4">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={endFakeCall}
                className="w-14 h-14 rounded-full bg-[#FF6B6B] hover:bg-rose-600 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                aria-label="Decline Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <span className="text-xs text-[#B8B5C9]">Decline</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={answerFakeCall}
                className="w-14 h-14 rounded-full bg-[#2DD4BF] hover:bg-teal-400 text-[#0B1020] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                aria-label="Accept Call"
              >
                <Phone className="w-6 h-6" />
              </button>
              <span className="text-xs text-[#B8B5C9]">Accept</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-2">
            {/* Active call grid controls */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                  isMuted ? 'bg-white text-[#0B1020]' : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-[10px]">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                  isSpeaker ? 'bg-white text-[#0B1020]' : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="text-[10px]">{isSpeaker ? 'Speaker' : 'Earpiece'}</span>
              </button>

              <button
                className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/15 flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <Grid className="w-5 h-5" />
                <span className="text-[10px]">Keypad</span>
              </button>
            </div>

            {/* End Call Button */}
            <div className="flex justify-center">
              <button
                onClick={endFakeCall}
                className="w-14 h-14 rounded-full bg-[#FF6B6B] hover:bg-rose-600 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                aria-label="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
