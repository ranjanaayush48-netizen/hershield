import React, { useState, useRef } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { 
  ShieldAlert, 
  MapPin, 
  Users, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Copy, 
  X, 
  Lock,
  PhoneCall,
  Share2,
  Loader2
} from 'lucide-react';

export const SosModal: React.FC = () => {
  const {
    isSosActive,
    isActivatingSos,
    activeSosEvent,
    isSosCountingDown,
    sosCountdown,
    cancelSosCountdown,
    confirmSosActivation,
    deactivateSos,
    contacts,
    currentLocation,
    sosEmergencyMessage,
    isSirenEnabled,
    toggleSiren,
    user,
    isQuickSosModalOpen,
    setQuickSosModalOpen
  } = useSafety();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Exact coordinates captured for this active SOS event
  const sosLat = activeSosEvent?.latitude ?? (currentLocation.latitude !== 0 ? currentLocation.latitude : null);
  const sosLon = activeSosEvent?.longitude ?? (currentLocation.longitude !== 0 ? currentLocation.longitude : null);
  const sosAcc = activeSosEvent?.accuracy ?? currentLocation.accuracy;
  const sosAddr = activeSosEvent?.address || currentLocation.address;

  // Hold-to-activate tracking
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);

  const startHold = () => {
    setIsHolding(true);
    const startTime = Date.now();
    const duration = 2000; // 2 seconds hold to trigger

    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current!);
        holdIntervalRef.current = null;
        setIsHolding(false);
        setHoldProgress(0);
        confirmSosActivation();
      }
    }, 40);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const handleDeactivate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput || pinInput.trim().length !== 4) {
      setPinError(true);
      return;
    }
    // Use the backend to check PIN
    const success = await deactivateSos(pinInput.trim());
    if (success) {
      setPinInput('');
      setPinError(false);
      setQuickSosModalOpen(false);
    } else {
      setPinError(true);
    }
  };

  const handleCopyMessage = () => {
    const locStr = sosLat !== null && sosLon !== null 
      ? ` Location: https://maps.google.com/?q=${sosLat},${sosLon}` 
      : '';
    navigator.clipboard.writeText(`${sosEmergencyMessage}${locStr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeContacts = contacts.filter(c => c.isActive && c.notifyOnSos);

  if (!isSosActive && !isSosCountingDown && !isQuickSosModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isSosActive 
            ? 'bg-[#1A1028] border-[#FF6B6B] shadow-rose-950/70' 
            : 'bg-[#1A1028] border-[#30263D] shadow-black/80'
        }`}
      >
        {/* Top Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isSosActive ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/30' : 'bg-[#0B1020]/60 border-[#30263D]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSosActive ? 'bg-[#FF6B6B] text-white animate-pulse' : 'bg-[#F43F6F]/20 text-[#F43F6F]'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isSosActive ? 'EMERGENCY SOS ACTIVE' : isSosCountingDown ? 'ACTIVATING EMERGENCY SOS' : 'Emergency Assistance'}
              </h2>
              <span className="text-xs text-[#B8B5C9]">
                {isSosActive ? 'Alert broadcast to trusted contacts' : 'Hold or confirm to broadcast urgent assistance alert'}
              </span>
            </div>
          </div>

          {!isSosActive && !isSosCountingDown && (
            <button 
              onClick={() => setQuickSosModalOpen(false)}
              className="text-[#B8B5C9] hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* STATE 1: COUNTDOWN IN PROGRESS */}
          {isSosCountingDown && (
            <div className="text-center py-6 space-y-4">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/20 animate-ping" />
                <div className="relative z-10 w-28 h-28 rounded-full bg-[#FF6B6B] text-white flex flex-col items-center justify-center shadow-lg shadow-rose-600/50">
                  <span className="text-4xl font-extrabold">{sosCountdown}</span>
                  <span className="text-xs uppercase tracking-wider font-semibold">Seconds</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Sending Alert in {sosCountdown}s</h3>
                <p className="text-sm text-[#B8B5C9]">
                  Broadcasting urgent notification & live coordinates to your {activeContacts.length} trusted contacts.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={cancelSosCountdown}
                  className="px-6 py-2.5 rounded-xl border border-[#30263D] text-white hover:bg-white/5 font-medium transition-colors"
                >
                  Cancel Immediately
                </button>
                <button
                  onClick={confirmSosActivation}
                  disabled={isActivatingSos}
                  className="px-6 py-2.5 rounded-xl bg-[#FF6B6B] text-white font-semibold hover:bg-[#ff5252] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isActivatingSos && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isActivatingSos ? 'Acquiring GPS...' : 'Send Right Now'}
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: ACTIVE SOS BROADCAST */}
          {isSosActive && (
            <div className="space-y-5">
              {/* Notice Banner based on actual delivery results */}
              {activeSosEvent?.delivery_status?.some(d => d.status === 'failed') ? (
                <div className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">FAST2SMS DISPATCH FAILED</strong>
                    <span>
                      {activeSosEvent.delivery_status.find(d => d.status === 'failed')?.provider_info || 'Carrier gateway rejected SMS delivery request.'}
                    </span>
                  </div>
                </div>
              ) : activeSosEvent?.delivery_status?.some(d => d.status === 'delivered') ? (
                <div className="bg-teal-500/15 border border-teal-500/40 rounded-xl p-3 text-xs text-teal-200 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 text-[#2DD4BF] mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">REAL CELLULAR SMS DELIVERED</strong>
                    <span>Fast2SMS gateway accepted and delivered live cellular SMS to your emergency recipients.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    <strong>SIMULATED DEMO ALERT:</strong> Backend recorded simulated notifications. Add a Fast2SMS key with active credits to send live cellular SMS.
                  </span>
                </div>
              )}

              {/* Status Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#0B1020] border border-[#30263D] rounded-xl p-3 text-center">
                  <span className="text-[11px] text-[#B8B5C9] block">Contacts Alerted</span>
                  <span className="text-lg font-bold text-white flex items-center justify-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-[#F43F6F]" />
                    {activeContacts.length} People
                  </span>
                </div>

                <div className="bg-[#0B1020] border border-[#30263D] rounded-xl p-3 text-center">
                  <span className="text-[11px] text-[#B8B5C9] block">Location Status</span>
                  <span className="text-xs font-bold text-[#2DD4BF] flex items-center justify-center gap-1.5 mt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {sosLat !== null && sosLon !== null 
                      ? `${sosLat.toFixed(4)}, ${sosLon.toFixed(4)}`
                      : 'Live Active'}
                  </span>
                </div>

                <div className="bg-[#0B1020] border border-[#30263D] rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-[#B8B5C9] block">Audible Siren</span>
                  <button
                    onClick={toggleSiren}
                    className="text-xs font-semibold text-white flex items-center justify-center gap-1.5 mt-1 mx-auto px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isSirenEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#FF6B6B] animate-pulse" />
                        Siren ON
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#B8B5C9]" />
                        Muted
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Emergency Message Preview */}
              <div className="bg-[#0B1020] border border-[#30263D] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#B8B5C9]">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#A78BFA]" />
                    SMS Dispatched to Contacts:
                  </span>
                  <button 
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1 text-[#A78BFA] hover:underline cursor-pointer"
                  >
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                </div>
                <div className="p-3 bg-[#1A1028] rounded-lg border border-[#30263D] text-xs font-mono text-rose-200 leading-relaxed">
                  "{sosEmergencyMessage}"
                  <div className="text-[11px] text-teal-300 mt-1 font-mono">
                    GPS Coordinates: {sosLat !== null && sosLon !== null ? `${sosLat.toFixed(4)}, ${sosLon.toFixed(4)}` : 'Acquiring GPS...'} {sosAddr ? `(${sosAddr})` : ''}
                  </div>
                </div>
              </div>

              {/* Recipient Contacts */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#B8B5C9] uppercase tracking-wider">Recipients Notified</span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {activeContacts.map((contact) => {
                    const statusItem = activeSosEvent?.delivery_status?.find(
                      d => d.contact_id === contact.id || d.phone === contact.phone
                    );
                    const isDelivered = statusItem?.status === 'delivered';
                    const isFailed = statusItem?.status === 'failed';

                    return (
                      <div key={contact.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B1020] border border-[#30263D] text-xs gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0 ${contact.avatarColor || 'bg-rose-500'}`}>
                            {contact.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-white truncate">{contact.name} ({contact.relationship})</div>
                            <div className="text-[11px] text-[#B8B5C9] truncate">{contact.phone}</div>
                          </div>
                        </div>

                        {isDelivered && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-[#2DD4BF] border border-teal-500/20 shrink-0 font-mono font-bold">
                            <CheckCircle className="w-3 h-3" /> SMS Delivered
                          </span>
                        )}
                        {isFailed && (
                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-[#FF6B6B] border border-rose-500/20 font-mono font-bold">
                              <X className="w-3 h-3" /> SMS Failed
                            </span>
                            <span className="text-[9px] text-rose-300 block max-w-[150px] truncate mt-0.5" title={statusItem.provider_info}>
                              {statusItem.provider_info}
                            </span>
                          </div>
                        )}
                        {!isDelivered && !isFailed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0 font-mono font-bold">
                            <CheckCircle className="w-3 h-3" /> Simulated Alert
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Safe Cancellation Form */}
              <form onSubmit={handleDeactivate} className="pt-2 border-t border-[#30263D] space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Lock className="w-4 h-4 text-[#B8B5C9] absolute left-3 top-3" />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Enter 4-digit PIN"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#2DD4BF] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[#B8B5C9]/60 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#2DD4BF] text-[#0B1020] font-bold text-sm hover:bg-[#25bca8] transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    I Am Safe (Cancel SOS)
                  </button>
                </div>
                {pinError && (
                  <p className="text-xs text-rose-400">Incorrect PIN.</p>
                )}
              </form>
            </div>
          )}

          {/* STATE 3: TRIGGER POPUP (When opened via quick modal button) */}
          {!isSosActive && !isSosCountingDown && (
            <div className="space-y-6 text-center py-2">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Emergency SOS Trigger</h3>
                <p className="text-sm text-[#B8B5C9] max-w-md mx-auto">
                  Quickly alert your trusted contacts when you feel unsafe. Press and hold below to prevent accidental activation.
                </p>
              </div>

              {/* Hold Button */}
              <div className="py-4">
                <button
                  onMouseDown={startHold}
                  onMouseUp={endHold}
                  onMouseLeave={endHold}
                  onTouchStart={startHold}
                  onTouchEnd={endHold}
                  className={`relative w-44 h-44 mx-auto rounded-full flex flex-col items-center justify-center text-white select-none transition-transform duration-200 cursor-pointer ${
                    isHolding ? 'scale-95' : 'hover:scale-105'
                  } bg-[#F43F6F] shadow-xl shadow-rose-950/60 sos-ring-animation`}
                >
                  {/* Circular progress fill ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle
                      cx="88"
                      cy="88"
                      r="80"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="80"
                      stroke="#FFFFFF"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="502"
                      strokeDashoffset={502 - (502 * holdProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-75"
                    />
                  </svg>

                  <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
                    <ShieldAlert className="w-8 h-8 mb-1" />
                    <span className="text-sm font-extrabold uppercase tracking-wider">
                      {isHolding ? `${holdProgress}%` : 'HOLD TO'}
                    </span>
                    <span className="text-xs font-semibold tracking-wide text-rose-100">
                      {isHolding ? 'HOLDING...' : 'ACTIVATE SOS'}
                    </span>
                  </div>
                </button>
                <span className="text-xs text-[#B8B5C9] block mt-3">
                  Hold for 2 seconds to activate immediately
                </span>
              </div>

              {/* Or Quick 5s Countdown Trigger */}
              <div className="pt-2 border-t border-[#30263D] flex items-center justify-center gap-3">
                <button
                  onClick={() => confirmSosActivation()}
                  disabled={isActivatingSos}
                  className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 text-xs font-medium border border-rose-500/40 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isActivatingSos && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isActivatingSos ? 'Acquiring GPS...' : 'Quick Test Alert (No Delay)'}
                </button>
                <a
                  href="tel:911"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#FF6B6B]" />
                  Call Local 911 / 112
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
