import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';
import { 
  ShieldAlert, 
  Users, 
  Navigation, 
  PhoneCall, 
  LifeBuoy, 
  FileWarning, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Phone, 
  Radio, 
  Activity,
  AlertCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    contacts, 
    locationSession, 
    isSosActive, 
    setQuickSosModalOpen,
    reports 
  } = useSafety();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const activeContactsCount = contacts.filter(c => c.isActive).length;
  const emergencyContactsCount = contacts.filter(c => c.isActive && c.isEmergency).length;

  const quickActionCards = [
    {
      id: 'sos',
      title: 'Emergency SOS',
      desc: 'Hold to alert trusted circle with coordinates',
      icon: ShieldAlert,
      route: '/sos',
      color: 'text-[#FF6B6B]',
      bg: 'bg-rose-500/15',
      border: 'hover:border-rose-500/60',
      badge: isSosActive ? 'ACTIVE NOW' : undefined,
      badgeColor: 'bg-[#FF6B6B] text-white animate-pulse'
    },
    {
      id: 'location',
      title: 'Share Location',
      desc: locationSession.isActive ? 'Active live sharing session' : 'Timed 15m/1h live GPS tracking',
      icon: Navigation,
      route: '/location',
      color: 'text-[#2DD4BF]',
      bg: 'bg-teal-500/15',
      border: 'hover:border-teal-500/60',
      badge: locationSession.isActive ? 'SHARING' : undefined,
      badgeColor: 'bg-[#2DD4BF] text-[#0B1020]'
    },
    {
      id: 'contacts',
      title: 'Trusted Contacts',
      desc: `${activeContactsCount} contacts in active safety circle`,
      icon: Users,
      route: '/contacts',
      color: 'text-[#A78BFA]',
      bg: 'bg-purple-500/15',
      border: 'hover:border-purple-500/60'
    },
    {
      id: 'fake-call',
      title: 'Fake Call Escort',
      desc: 'Simulate urgent incoming call to step away',
      icon: PhoneCall,
      route: '/fake-call',
      color: 'text-pink-400',
      bg: 'bg-pink-500/15',
      border: 'hover:border-pink-500/60'
    },
    {
      id: 'find-help',
      title: 'Find Help',
      desc: 'Nearest police, hospitals, and 24/7 shelters',
      icon: LifeBuoy,
      route: '/find-help',
      color: 'text-[#2DD4BF]',
      bg: 'bg-teal-500/15',
      border: 'hover:border-teal-500/60'
    },
    {
      id: 'report',
      title: 'Report Incident',
      desc: 'Log harassment or unsafe corridor privately',
      icon: FileWarning,
      route: '/report',
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'hover:border-amber-500/60'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome & Safety Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wider">
            Personal Security Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {getGreeting()}, {user?.name || 'Sophia'}
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1">
            HerShield security services are active and monitoring your personal network.
          </p>
        </div>

        {/* Quick Trigger Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setQuickSosModalOpen(true)}
            className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
              isSosActive
                ? 'bg-[#FF6B6B] text-white animate-pulse'
                : 'bg-[#F43F6F] hover:bg-[#e03360] text-white shadow-sm'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSosActive ? 'Manage SOS Alert' : 'Trigger SOS'}</span>
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* MAIN SAFETY STATUS CARD */}
      {/* ================================================== */}
      <div className={`rounded-xl border p-6 sm:p-7 transition-colors ${
        isSosActive 
          ? 'bg-[#1A1028] border-[#FF6B6B]' 
          : 'bg-[#1A1028] border-[#30263D]'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#30263D]">
          
          {/* Status Label */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
              isSosActive 
                ? 'bg-[#FF6B6B] text-white animate-pulse' 
                : 'bg-teal-500/15 text-[#2DD4BF] safe-ring-animation'
            }`}>
              {isSosActive ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-[#2DD4BF]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {isSosActive ? "EMERGENCY SOS BROADCAST ACTIVE" : "System Safe / Standby"}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isSosActive ? 'bg-rose-500 text-white' : 'bg-teal-500/15 text-[#2DD4BF] border border-teal-500/20'
                }`}>
                  {isSosActive ? 'Emergency' : 'Optimal'}
                </span>
              </div>
              <p className="text-xs text-[#B8B5C9] mt-0.5">
                {isSosActive 
                  ? "Real-time distress notifications and GPS tracking broadcasted to contacts." 
                  : "All security check-ins completed. No threat signals logged in your immediate vicinity."}
              </p>
            </div>
          </div>

          {/* Quick Action Button within Status Card */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {isSosActive ? (
              <button
                onClick={() => setQuickSosModalOpen(true)}
                className="w-full lg:w-auto px-4 py-2 rounded-lg bg-[#2DD4BF] text-[#0B1020] font-bold text-xs hover:bg-[#25bca8] transition-colors"
              >
                Mark As Safe (Deactivate SOS)
              </button>
            ) : (
              <Link
                to="/safe-route"
                className="w-full lg:w-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-[#30263D] transition-colors text-center"
              >
                Run Safe Route Check
              </Link>
            )}
          </div>
        </div>

        {/* 4 Status Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          
          {/* Current Status */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#B8B5C9] uppercase tracking-wider font-semibold block">
              Current Status
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <span className={`w-2 h-2 rounded-full ${isSosActive ? 'bg-[#FF6B6B] animate-ping' : 'bg-[#2DD4BF]'}`} />
              <span>{isSosActive ? 'SOS Activated' : 'Normal / Standby'}</span>
            </div>
          </div>

          {/* Location Sharing */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#B8B5C9] uppercase tracking-wider font-semibold block">
              Location Sharing
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Navigation className={`w-3.5 h-3.5 ${locationSession.isActive ? 'text-[#2DD4BF] animate-pulse' : 'text-[#B8B5C9]'}`} />
              <span>{locationSession.isActive ? `Active (${locationSession.durationMinutes}m)` : 'Stopped'}</span>
            </div>
          </div>

          {/* Trusted Contacts */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#B8B5C9] uppercase tracking-wider font-semibold block">
              Trusted Contacts
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Users className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>{emergencyContactsCount} Primary Responders</span>
            </div>
          </div>

          {/* Last Check-In */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#B8B5C9] uppercase tracking-wider font-semibold block">
              Last Safety Check
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Clock className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>{user?.lastSafetyCheck || 'Today at 6:45 PM'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* QUICK ACTIONS GRID */}
      {/* ================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Quick Actions</h3>
          <span className="text-xs text-[#B8B5C9]">Direct security tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActionCards.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.id}
                to={act.route}
                className={`bg-[#1A1028] border border-[#30263D] ${act.border} rounded-xl p-4 sm:p-5 flex items-start gap-4 transition-colors group`}
              >
                <div className={`w-10 h-10 rounded-lg ${act.bg} ${act.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#A78BFA] transition-colors truncate">
                      {act.title}
                    </h4>
                    {act.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${act.badgeColor}`}>
                        {act.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#B8B5C9] mt-1 line-clamp-2 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* 2-COLUMN SECTION: RECENT ACTIVITY & FAST DIAL WIDGET */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Safety Timeline & Recent Reports */}
        <div className="lg:col-span-2 bg-[#1A1028] border border-[#30263D] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#30263D] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2DD4BF]" />
              Recent Safety Activity & Checkpoints
            </h3>
            <Link to="/report" className="text-xs text-[#A78BFA] hover:underline">
              View All Logs
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#30263D] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                <div>
                  <div className="font-semibold text-white">Safe Route Completed</div>
                  <div className="text-[#B8B5C9] text-[11px]">Downtown Hub to Metro Station (Score 88/100)</div>
                </div>
              </div>
              <span className="text-[#B8B5C9]/80 font-mono text-[10px]">Today 6:30 PM</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#30263D] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                <div>
                  <div className="font-semibold text-white">Trusted Circle Verified</div>
                  <div className="text-[#B8B5C9] text-[11px]">Test alert verified with Elena Rostova (+1 555-482-9912)</div>
                </div>
              </div>
              <span className="text-[#B8B5C9]/80 font-mono text-[10px]">Yesterday</span>
            </div>

            {reports.slice(0, 1).map(r => (
              <div key={r.id} className="p-3 rounded-lg bg-[#0B1020] border border-[#30263D] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div>
                    <div className="font-semibold text-white">Incident Report Logged: {r.type}</div>
                    <div className="text-[#B8B5C9] text-[11px] truncate max-w-xs">{r.location} - Status: {r.status}</div>
                  </div>
                </div>
                <span className="text-[#B8B5C9]/80 font-mono text-[10px]">{r.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Instant Emergency Hotlines */}
        <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF6B6B]" />
              Emergency Hotlines
            </h3>
            <p className="text-xs text-[#B8B5C9]">
              Direct contact buttons for 24/7 national and local emergency dispatch.
            </p>

            <div className="space-y-2 pt-1">
              <a
                href="tel:911"
                className="w-full p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-white flex items-center justify-between hover:bg-rose-500/25 transition-colors"
              >
                <div>
                  <span className="font-bold text-xs block text-[#FF6B6B]">Emergency Police / Ambulance</span>
                  <span className="text-[11px] text-[#B8B5C9]">Dial 911 (North America) / 112 (EU)</span>
                </div>
                <span className="font-mono text-xs font-bold text-white bg-[#FF6B6B] px-2 py-0.5 rounded">911</span>
              </a>

              <a
                href="tel:18007997233"
                className="w-full p-3 rounded-lg bg-[#0B1020] border border-[#30263D] text-white flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div>
                  <span className="font-semibold text-xs block text-white">Women Domestic Violence Hotline</span>
                  <span className="text-[11px] text-[#B8B5C9]">Confidential 24/7 Helpline</span>
                </div>
                <span className="text-xs text-[#A78BFA] font-semibold">Call</span>
              </a>
            </div>
          </div>

          <Link
            to="/find-help"
            className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold text-center border border-[#30263D] transition-colors mt-2"
          >
            Browse All Local Sanctuaries →
          </Link>
        </div>

      </div>

    </div>
  );
};
