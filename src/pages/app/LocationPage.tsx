import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Share2, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Compass,
  Radio
} from 'lucide-react';

export const LocationPage: React.FC = () => {
  const { 
    currentLocation, 
    locationSession, 
    startLocationSharing, 
    stopLocationSharing, 
    contacts 
  } = useSafety();

  const [selectedDuration, setSelectedDuration] = useState<number | null>(60);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(
    contacts.map(c => c.id)
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds(selectedContactIds.filter(cId => cId !== id));
    } else {
      setSelectedContactIds([...selectedContactIds, id]);
    }
  };

  const handleStartSharing = () => {
    startLocationSharing(selectedDuration, selectedContactIds);
  };

  const handleCopyLink = () => {
    const trackingUrl = locationSession.shareUrl
      ? `${window.location.origin}${locationSession.shareUrl}`
      : `${window.location.origin}/api/location/track/live-placeholder`;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-wider">
            Controlled GPS Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Live Location Sharing
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1">
            Zero continuous background tracking. You control who sees your position and for how long.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            locationSession.isActive 
              ? 'bg-teal-500/15 text-[#2DD4BF] border border-teal-500/30' 
              : 'bg-white/5 text-[#B8B5C9] border border-[#30263D]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${locationSession.isActive ? 'bg-[#2DD4BF] animate-ping' : 'bg-gray-500'}`} />
            {locationSession.isActive ? 'Live Sharing Active' : 'Session Inactive'}
          </span>
        </div>
      </div>

      {/* Realistic Map-Style Canvas / Radar View */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-[#090D1A] border border-[#30263D] overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Subtle Map Grid lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#30263D 1px, transparent 1px), linear-gradient(to right, #1F172E 1px, transparent 1px), linear-gradient(to bottom, #1F172E 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Concentric GPS radar rings */}
        <div className="absolute w-72 h-72 rounded-full border border-teal-500/20 animate-ping pointer-events-none opacity-40" />
        <div className="absolute w-52 h-52 rounded-full border border-[#A78BFA]/20 pointer-events-none" />
        <div className="absolute w-32 h-32 rounded-full border border-teal-500/30 pointer-events-none" />

        {/* Center Target Pin */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#2DD4BF] flex items-center justify-center shadow-md">
            <div className="w-10 h-10 bg-[#0B1020] rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-[#2DD4BF]" />
            </div>
          </div>
          
          <div className="mt-3 px-3 py-1 rounded-md bg-[#1A1028] border border-[#30263D] text-xs text-white font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
            <span>{currentLocation.address}</span>
          </div>
        </div>

        {/* Compass & Precision HUD Overlays */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#1A1028]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#30263D] text-[11px] text-[#B8B5C9]">
          <Compass className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Bearing: 284° NW</span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#1A1028]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#30263D] text-[11px] font-mono text-[#2DD4BF]">
          <span>±{currentLocation.accuracy}m GPS Precision</span>
        </div>

        {/* Bottom map overlay disclaimer */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[10px] text-[#B8B5C9]/80 px-2">
          <span>Realistic map preview simulation for demonstration</span>
          <span>Lat: {currentLocation.latitude.toFixed(4)}, Lon: {currentLocation.longitude.toFixed(4)}</span>
        </div>
      </div>

      {/* ================================================== */}
      {/* SHARING CONTROLS & DURATION SELECTOR */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sharing Options (Left 2 cols) */}
        <div className="lg:col-span-2 bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-6">
          
          <div>
            <h3 className="text-base font-bold text-white">1. Select Sharing Duration</h3>
            <p className="text-xs text-[#B8B5C9] mt-0.5">
              The broadcast automatically expires when the timer terminates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <button
                type="button"
                onClick={() => setSelectedDuration(15)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedDuration === 15
                    ? 'bg-teal-500/15 border-[#2DD4BF] text-white shadow-md'
                    : 'bg-[#0B1020] border-[#30263D] text-[#B8B5C9] hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4 text-[#2DD4BF] mb-2" />
                <span className="text-sm font-bold block">15 Minutes</span>
                <span className="text-[11px] opacity-80">Short walk or rideshare</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDuration(60)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedDuration === 60
                    ? 'bg-teal-500/15 border-[#2DD4BF] text-white shadow-md'
                    : 'bg-[#0B1020] border-[#30263D] text-[#B8B5C9] hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4 text-[#2DD4BF] mb-2" />
                <span className="text-sm font-bold block">1 Hour</span>
                <span className="text-[11px] opacity-80">Commute / late night out</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDuration(null)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedDuration === null
                    ? 'bg-teal-500/15 border-[#2DD4BF] text-white shadow-md'
                    : 'bg-[#0B1020] border-[#30263D] text-[#B8B5C9] hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4 text-[#2DD4BF] mb-2" />
                <span className="text-sm font-bold block">Until Stopped</span>
                <span className="text-[11px] opacity-80">Manual deactivation only</span>
              </button>
            </div>
          </div>

          {/* Contact Recipients */}
          <div>
            <h3 className="text-base font-bold text-white">2. Select Designated Recipients</h3>
            <p className="text-xs text-[#B8B5C9] mt-0.5">
              Only checked contacts receive the encrypted live map link.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {contacts.map((c) => {
                const isChecked = selectedContactIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleContact(c.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#0B1020] border-[#A78BFA] text-white'
                        : 'bg-[#0B1020]/50 border-[#30263D] text-[#B8B5C9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/15 text-[#A78BFA] flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{c.name}</span>
                        <span className="text-[10px] text-[#B8B5C9]">{c.relationship}</span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-[#A78BFA] bg-[#1A1028] border-[#30263D] pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-4 border-t border-[#30263D] flex flex-col sm:flex-row items-center gap-4">
            {locationSession.isActive ? (
              <button
                onClick={stopLocationSharing}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-[#FF6B6B] border border-rose-500/40 font-bold text-xs transition-colors cursor-pointer"
              >
                Stop Sharing Location
              </button>
            ) : (
              <button
                onClick={handleStartSharing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs text-[#0B1020] bg-[#2DD4BF] hover:bg-[#25bfa8] shadow-lg shadow-teal-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Location Sharing</span>
              </button>
            )}

            {locationSession.isActive && (
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-[#30263D] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Tracking Link Copied' : 'Copy Live Tracking Link'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Active Session Card & Safety Guarantees */}
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
              Session Telemetry Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D]">
                <span className="text-[#B8B5C9] text-[10px] uppercase font-bold block">Current Coordinates</span>
                <span className="text-white font-mono block mt-0.5">
                  {(locationSession.isActive ? locationSession.latitude : currentLocation.latitude).toFixed(4)}, {(locationSession.isActive ? locationSession.longitude : currentLocation.longitude).toFixed(4)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D]">
                <span className="text-[#B8B5C9] text-[10px] uppercase font-bold block">Active Duration</span>
                <span className="text-white font-medium block mt-0.5">
                  {locationSession.isActive 
                    ? (locationSession.durationMinutes ? `${locationSession.durationMinutes} Minutes` : 'Until Stopped')
                    : 'Not actively streaming'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D]">
                <span className="text-[#B8B5C9] text-[10px] uppercase font-bold block">Authorized Recipients</span>
                <span className="text-white font-medium block mt-0.5">
                  {selectedContactIds.length} of {contacts.length} Contacts
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B1020] border border-[#30263D] text-[11px] text-[#B8B5C9] leading-relaxed">
            <span className="font-bold text-white block mb-1">Privacy Guarantee</span>
            When this session ends, the web link immediately expires. Past coordinate logs are deleted and inaccessible.
          </div>

        </div>

      </div>

    </div>
  );
};
