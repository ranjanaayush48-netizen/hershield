import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { 
  Lock, 
  User, 
  Bell, 
  ShieldAlert, 
  Trash2, 
  CheckCircle2, 
  Smartphone, 
  Save,
  RotateCcw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, updateEmergencyPin, updateCustomSosMessage, addNotification } = useSafety();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');

  const [sosMessage, setSosMessage] = useState(
    user?.customSosMessage || 'EMERGENCY: I may need assistance. My real-time location is being shared with you via HerShield.'
  );
  const [msgSaved, setMsgSaved] = useState(false);

  // Preference Toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoLocationShareOnSos, setAutoLocationShareOnSos] = useState(true);

  React.useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.phone !== undefined) setPhone(user.phone);
    }
  }, [user?.name, user?.phone]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile({ name: fullName, phone });
      setProfileError('');
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setPinError('PIN entries do not match.');
      return;
    }

    updateEmergencyPin(pin);
    setPinError('');
    setPinSuccess(true);
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleSosMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomSosMessage(sosMessage);
    setMsgSaved(true);
    setTimeout(() => setMsgSaved(false), 3000);
  };

  const handleClearDemoData = () => {
    if (window.confirm('Reset all demo data back to default sandbox state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wider">
          Configuration & Privacy
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Safety Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1">
          Configure cancellation security codes, broadcast templates, and alert delivery mechanisms.
        </p>
      </div>

      {/* 1. Personal Profile Information */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#A78BFA]" />
            Personal Profile Information
          </h3>
          <p className="text-xs text-[#B8B5C9]">
            Update your full name and contact phone number used across emergency alerts and trusted contact dispatches.
          </p>
        </div>

        {profileSuccess && (
          <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile successfully updated.</span>
          </div>
        )}

        {profileError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-[#FF6B6B] text-xs">
            {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B5C9]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B5C9]">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#A78BFA] hover:bg-[#906cef] text-[#0B1020] font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Details</span>
          </button>
        </form>
      </div>

      {/* 2. Emergency PIN Management */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2DD4BF]" />
            Emergency Cancellation PIN
          </h3>
          <p className="text-xs text-[#B8B5C9]">
            This 4-digit code is required to deactivate an active SOS alert. It prevents an aggressor from forcing you to silence the alarm.
          </p>
        </div>

        {pinSuccess && (
          <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Emergency PIN successfully updated.</span>
          </div>
        )}

        {pinError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-[#FF6B6B] text-xs">
            {pinError}
          </div>
        )}

        <form onSubmit={handlePinSubmit} className="space-y-4 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B8B5C9]">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#2DD4BF] rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-mono text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B8B5C9]">Confirm PIN</label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#2DD4BF] rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-mono text-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#25bfa8] text-[#0B1020] font-bold text-xs transition-colors cursor-pointer"
          >
            Update Security PIN
          </button>
        </form>
      </div>

      {/* 2. Custom SOS Broadcast Message */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF6B6B]" />
            Emergency Distress Broadcast Message
          </h3>
          <p className="text-xs text-[#B8B5C9]">
            This text is automatically dispatched to your primary emergency contacts during SOS. Coordinates and live link are appended automatically.
          </p>
        </div>

        {msgSaved && (
          <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Broadcast message saved.</span>
          </div>
        )}

        <form onSubmit={handleSosMessageSubmit} className="space-y-4">
          <textarea
            rows={3}
            value={sosMessage}
            onChange={(e) => setSosMessage(e.target.value)}
            className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#FF6B6B] rounded-xl p-3.5 text-sm text-white outline-none resize-none font-mono"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#F43F6F] hover:bg-[#e03360] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Message Template</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Notification & Hardware Preferences */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#A78BFA]" />
          Alert Behaviors & Automation
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#0B1020] border border-[#30263D] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Auto-Activate 1h Live Tracking on SOS</span>
              <span className="text-[11px] text-[#B8B5C9]">Begins streaming GPS coordinates immediately when SOS triggers</span>
            </div>
            <input
              type="checkbox"
              checked={autoLocationShareOnSos}
              onChange={(e) => setAutoLocationShareOnSos(e.target.checked)}
              className="w-4 h-4 rounded text-[#A78BFA] bg-[#1A1028] border-[#30263D]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B1020] border border-[#30263D] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Synthesized Siren & Ringtone Audio</span>
              <span className="text-[11px] text-[#B8B5C9]">Play Web Audio synthesizer tones for incoming fake calls and alarms</span>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 rounded text-[#A78BFA] bg-[#1A1028] border-[#30263D]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B1020] border border-[#30263D] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">SMS Delivery Simulation</span>
              <span className="text-[11px] text-[#B8B5C9]">Log simulated outbound SMS callbacks in browser console</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#A78BFA] bg-[#1A1028] border-[#30263D]"
            />
          </div>
        </div>
      </div>

      {/* 4. Reset Sandbox Data */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-rose-400">
          <Trash2 className="w-4 h-4" />
          Reset Sandbox State
        </h3>
        <p className="text-xs text-[#B8B5C9]">
          Clear all locally persisted contacts, custom PINs, and incident reports to reset the application to its original clean state.
        </p>

        <button
          onClick={handleClearDemoData}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-[#30263D] hover:border-rose-500/30 text-xs font-semibold text-rose-400 transition-colors cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

    </div>
  );
};
