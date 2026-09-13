import React, { useState, useRef } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { 
  ShieldAlert, 
  Users, 
  Navigation, 
  Lock, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  MapPin, 
  Clock,
  Phone,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OFFICIAL_DISCLAIMER } from '../../data/emergencyServicesIndia';

export const SosPage: React.FC = () => {
  const { 
    isSosActive, 
    isActivatingSos,
    activeSosEvent,
    confirmSosActivation, 
    deactivateSos, 
    contacts, 
    selectedSosContactIds,
    toggleSosRecipientSelection,
    setSelectedSosContactIds,
    currentLocation, 
    user 
  } = useSafety();

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);

  // Exact coordinates captured for this active SOS event
  const sosLat = activeSosEvent?.latitude ?? (currentLocation.latitude !== 0 ? currentLocation.latitude : null);
  const sosLon = activeSosEvent?.longitude ?? (currentLocation.longitude !== 0 ? currentLocation.longitude : null);
  const sosAcc = activeSosEvent?.accuracy ?? currentLocation.accuracy;
  const sosAddr = activeSosEvent?.address || currentLocation.address;

  // Cancellation PIN input
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);

  const eligibleContacts = contacts.filter(c => c.isActive && c.notifyOnSos);
  const selectedCount = selectedSosContactIds.length;

  const selectAllRecipients = () => {
    setSelectedSosContactIds(eligibleContacts.map(c => c.id));
  };

  const deselectAllRecipients = () => {
    setSelectedSosContactIds([]);
  };

  const startHold = () => {
    if (isSosActive || isActivatingSos) return;
    setIsHolding(true);
    const start = Date.now();
    const duration = 2000;

    holdTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(pct);

      if (pct >= 100) {
        clearInterval(holdTimerRef.current!);
        holdTimerRef.current = null;
        setIsHolding(false);
        setHoldProgress(0);
        confirmSosActivation();
      }
    }, 40);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin || enteredPin.trim().length !== 4) {
      setPinError(true);
      return;
    }
    setIsSubmittingPin(true);
    const success = await deactivateSos(enteredPin.trim());
    setIsSubmittingPin(false);
    if (success) {
      setEnteredPin('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase font-bold text-[#FF6B6B] tracking-wider">
          High-Priority Alert Dispatch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Emergency SOS
        </h1>
        <p className="text-sm text-[#B8B5C9]">
          Quickly alert your trusted contacts when you feel unsafe. Designed with intentional hold activation to avoid accidental triggers.
        </p>
      </div>

      {/* Official Emergency Disclaimer & Direct Call Buttons */}
      <div className="bg-[#1A1028] border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#B8B5C9]">
        <div className="flex items-start sm:items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-amber-100/90 leading-relaxed">
            {OFFICIAL_DISCLAIMER}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <a
            href="tel:112"
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-[#FF6B6B] hover:bg-rose-500/30 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>
          <a
            href="tel:181"
            className="px-3 py-1.5 rounded-lg bg-[#A78BFA]/20 text-[#A78BFA] hover:bg-[#A78BFA]/30 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 181</span>
          </a>
        </div>
      </div>

      {/* ================================================== */}
      {/* ACTIVE SOS SCREEN OR HOLD BUTTON */}
      {/* ================================================== */}
      {isSosActive ? (
        <div className="bg-[#1A1028] border-2 border-[#FF6B6B] rounded-xl p-6 sm:p-10 space-y-8 shadow-2xl shadow-rose-950/70">
          
          {/* Active Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center animate-pulse shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">EMERGENCY BROADCAST IN PROGRESS</h3>
                <p className="text-xs text-[#FF6B6B]">
                  Distress packets logged and sent to {eligibleContacts.length} active contacts with live coordinates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-black/40 text-white px-3 py-1.5 rounded-lg border border-[#30263D]">
                GPS: {sosLat !== null && sosLon !== null ? `${sosLat.toFixed(4)}, ${sosLon.toFixed(4)}` : 'Acquiring GPS...'}
              </span>
            </div>
          </div>

          {/* Emergency Message Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#B8B5C9] uppercase tracking-wider">
              Emergency Message Dispatched to Contacts:
            </span>
            <div className="p-4 rounded-2xl bg-[#0B1020] border border-[#30263D] text-sm text-white font-mono space-y-1">
              <p className="text-[#FF6B6B] font-bold">
                [HerShield SOS Alert] I need immediate assistance. My coordinates have been dispatched:
              </p>
              <p className="text-xs text-[#2DD4BF] font-mono">
                GPS Coordinates: {sosLat !== null && sosLon !== null ? `${sosLat.toFixed(4)}, ${sosLon.toFixed(4)}` : 'Acquiring GPS...'}
              </p>
              {sosAddr && (
                <p className="text-xs text-[#B8B5C9]">
                  {sosAddr} {sosAcc ? `(±${sosAcc}m)` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Contact Dispatch Status Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B8B5C9] uppercase tracking-wider">
                Emergency Alert Delivery Status:
              </span>
              <span className="text-xs font-semibold text-[#2DD4BF]">
                {activeSosEvent?.contacts_notified_count !== undefined 
                  ? `${activeSosEvent.contacts_notified_count} Recipient(s) Dispatched` 
                  : 'Dispatch in progress'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSosEvent?.delivery_status && activeSosEvent.delivery_status.length > 0 ? (
                activeSosEvent.delivery_status.map((item, idx) => {
                  const isDelivered = item.status === 'delivered';
                  const isFailed = item.status === 'failed';
                  const isSimulated = item.status === 'simulated_local';

                  return (
                    <div key={item.contact_id || idx} className="p-3.5 rounded-xl bg-[#0B1020] border border-[#30263D] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] font-bold text-xs flex items-center justify-center shrink-0">
                          {item.contact_name ? item.contact_name.charAt(0) : 'C'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">{item.contact_name}</span>
                          <span className="text-[10px] text-[#B8B5C9] font-mono block truncate">{item.phone}</span>
                        </div>
                      </div>

                      {isDelivered && (
                        <span className="text-[10px] text-[#2DD4BF] bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full font-mono flex items-center gap-1 font-bold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          SMS Delivered
                        </span>
                      )}
                      {isFailed && (
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-[#FF6B6B] bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full font-mono flex items-center gap-1 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            SMS Failed
                          </span>
                          <span className="text-[9px] text-rose-300 block max-w-[170px] truncate mt-0.5" title={item.provider_info}>
                            {item.provider_info}
                          </span>
                        </div>
                      )}
                      {isSimulated && (
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-mono flex items-center gap-1 font-bold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Simulated Alert
                        </span>
                      )}
                    </div>
                  );
                })
              ) : eligibleContacts.length > 0 ? (
                eligibleContacts
                  .filter(c => selectedSosContactIds.length === 0 || selectedSosContactIds.includes(c.id))
                  .map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#0B1020] border border-[#30263D] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] font-bold text-xs flex items-center justify-center">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{c.name}</span>
                          <span className="text-[10px] text-[#B8B5C9]">{c.relationship} • {c.phone}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#2DD4BF] font-mono flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Dispatched
                      </span>
                    </div>
                  ))
              ) : (
                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#30263D] col-span-2 text-center text-xs text-[#B8B5C9]">
                  No trusted contacts were configured for emergency dispatch.
                </div>
              )}
            </div>
          </div>

          {/* PIN-Protected Deactivation */}
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#30263D] space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#A78BFA]" />
                Deactivate & Mark Safe (PIN Required)
              </h4>
              <p className="text-xs text-[#B8B5C9]">
                Enter your 4-digit security PIN to mark yourself safe and stop the emergency broadcast.
              </p>
            </div>

            <form onSubmit={handleDeactivate} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter 4-digit PIN"
                className="w-full sm:w-48 bg-[#1A1028] border border-[#30263D] focus:border-[#2DD4BF] rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-mono text-white outline-none"
              />

              <button
                type="submit"
                disabled={isSubmittingPin}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#26b5a2] text-[#0B1020] font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingPin ? 'Verifying PIN...' : 'Mark As Safe & Stop SOS'}
              </button>
            </form>

            {pinError && (
              <p className="text-xs text-[#FF6B6B]">
                Incorrect security PIN. Please try again.
              </p>
            )}
          </div>

        </div>
      ) : (
        /* SOS Inactive: Show Large Press-and-Hold Button */
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-8 sm:p-14 text-center space-y-8 shadow-xl">
          
          {isActivatingSos && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 flex items-center justify-center gap-3 max-w-md mx-auto">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-bold text-white">Acquiring Live GPS Position...</p>
                <p className="text-xs text-amber-200/80">Reading high-accuracy satellite coordinates from device sensors before emergency dispatch.</p>
              </div>
            </div>
          )}

          <div className="relative flex flex-col items-center">
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              disabled={isActivatingSos}
              className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center text-white select-none transition-transform duration-200 cursor-pointer ${
                isActivatingSos ? 'opacity-70 cursor-not-allowed scale-95' : isHolding ? 'scale-95' : 'hover:scale-105'
              } bg-[#F43F6F] shadow-xl shadow-rose-950/60 sos-ring-animation`}
            >
              {/* SVG Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="650"
                  strokeDashoffset={650 - (650 * holdProgress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />
              </svg>

              <div className="relative z-10 flex flex-col items-center justify-center p-4">
                {isActivatingSos ? (
                  <>
                    <Loader2 className="w-10 h-10 mb-2 animate-spin text-white" />
                    <span className="text-sm font-black tracking-wider uppercase">
                      READING GPS
                    </span>
                    <span className="text-xs font-bold text-rose-100 tracking-wider">
                      PLEASE WAIT...
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-12 h-12 mb-2" />
                    <span className="text-lg sm:text-xl font-black tracking-wider uppercase">
                      {isHolding ? `${holdProgress}%` : 'HOLD TO'}
                    </span>
                    <span className="text-xs font-bold text-rose-100 tracking-wider">
                      {isHolding ? 'HOLDING...' : 'ACTIVATE SOS'}
                    </span>
                  </>
                )}
              </div>
            </button>

            <p className="text-xs text-[#B8B5C9] mt-6 max-w-sm">
              Press and hold continuously for 2 seconds to initiate the emergency protocol.
            </p>
          </div>

          {/* Emergency Alert Recipient Selection */}
          <div className="bg-[#0B1020] border border-[#30263D] rounded-2xl p-5 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30263D] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#A78BFA]" />
                  Designated Emergency Recipients
                </h3>
                <p className="text-xs text-[#B8B5C9] mt-0.5">
                  Selected contacts will immediately receive your live GPS coordinates via SMS.
                </p>
              </div>

              {eligibleContacts.length > 0 && (
                <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                  <button
                    type="button"
                    onClick={selectAllRecipients}
                    className="text-[#A78BFA] hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-[#30263D]">•</span>
                  <button
                    type="button"
                    onClick={deselectAllRecipients}
                    className="text-[#B8B5C9] hover:text-white font-semibold cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              )}
            </div>

            {eligibleContacts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {eligibleContacts.map(c => {
                  const isSelected = selectedSosContactIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleSosRecipientSelection(c.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#A78BFA]/10 border-[#A78BFA]/50 text-white' 
                          : 'bg-[#1A1028] border-[#30263D] text-[#B8B5C9] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-[#A78BFA] text-white' : 'bg-white/10 text-[#B8B5C9]'
                        }`}>
                          {c.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold block truncate">{c.name}</span>
                          <span className="text-[10px] text-[#B8B5C9] block font-mono truncate">{c.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {c.isEmergency && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-[#FF6B6B] border border-rose-500/30 font-bold">
                            Primary
                          </span>
                        )}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by outer div onClick
                          className="w-4 h-4 rounded text-[#A78BFA] focus:ring-0 bg-[#1A1028] border-[#30263D] cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#1A1028] border border-[#30263D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B8B5C9]">
                <span>No active contacts configured for SOS alerts. Add trusted contacts to notify them in emergencies.</span>
                <Link
                  to="/contacts"
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors shrink-0"
                >
                  Add Trusted Contacts →
                </Link>
              </div>
            )}

            {eligibleContacts.length > 0 && (
              <div className="flex items-center justify-between text-[11px] pt-1 text-[#B8B5C9]">
                <span>
                  {selectedCount} of {eligibleContacts.length} contacts selected for emergency broadcast
                </span>
                {selectedCount === 0 && (
                  <span className="text-amber-400 font-semibold">
                    Warning: 0 recipients selected. SOS will be logged with no SMS recipients.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#30263D] text-left">
            <div className="bg-[#0B1020] border border-[#30263D] rounded-xl p-4">
              <span className="text-[10px] text-[#B8B5C9] uppercase font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#A78BFA]" />
                Designated Responders
              </span>
              <span className="text-sm font-bold text-white block mt-1">
                {selectedCount} Selected ({eligibleContacts.length} Total)
              </span>
              <Link to="/contacts" className="text-[11px] text-[#A78BFA] hover:underline block mt-1">
                Manage circle →
              </Link>
            </div>

            <div className="bg-[#0B1020] border border-[#30263D] rounded-xl p-4">
              <span className="text-[10px] text-[#B8B5C9] uppercase font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Live Coordinates
              </span>
              <span className="text-sm font-bold text-white block mt-1 truncate">
                {currentLocation.address || 'Locating GPS...'}
              </span>
              <span className="text-[11px] text-[#2DD4BF] block mt-1">
                GPS Status: {currentLocation.status === 'granted' ? `Active (±${currentLocation.accuracy}m)` : currentLocation.status}
              </span>
            </div>

            <div className="bg-[#0B1020] border border-[#30263D] rounded-xl p-4">
              <span className="text-[10px] text-[#B8B5C9] uppercase font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                Security PIN
              </span>
              <span className="text-sm font-bold text-white block mt-1">
                Set to 4 Digits
              </span>
              <Link to="/settings" className="text-[11px] text-pink-400 hover:underline block mt-1">
                Change in Settings →
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
