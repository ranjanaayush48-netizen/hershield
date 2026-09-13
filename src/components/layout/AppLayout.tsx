import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';
import { 
  Shield, 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  Navigation, 
  PhoneCall, 
  LifeBuoy, 
  FileWarning, 
  Settings, 
  Route, 
  LogOut, 
  Menu, 
  X, 
  MapPin, 
  MoreHorizontal,
  Home,
  WifiOff
} from 'lucide-react';
import { DemoDisclaimerBanner } from '../common/DemoDisclaimerBanner';
import { SosModal } from '../common/SosModal';
import { FakeCallOverlay } from '../common/FakeCallOverlay';
import { NotificationToast } from '../common/NotificationToast';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-white shadow-lg border border-amber-400/20">
      <WifiOff className="w-3.5 h-3.5 animate-pulse" />
      <span>Offline Mode — Cached data is being used.</span>
    </div>
  );
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="hidden md:flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 text-xs font-medium text-[#2DD4BF] shadow-sm hover:bg-teal-500/20 transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Install App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="hidden md:flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 text-xs font-medium text-[#2DD4BF] shadow-sm hover:bg-teal-500/20 transition"
        >
          Install App
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#1A1028] p-6 shadow-xl border border-[#30263D]">
              <h3 className="text-lg font-semibold text-white">Install on iPhone / iPad</h3>
              <p className="mt-2 text-sm text-[#B8B5C9]">
                1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-lg bg-white/10 py-2 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    logout, 
    isSosActive, 
    locationSession, 
    setQuickSosModalOpen,
    isFakeCallScheduled,
    fakeCallCountdown
  } = useSafety();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Emergency SOS', path: '/sos', icon: ShieldAlert, danger: true },
    { name: 'Trusted Contacts', path: '/contacts', icon: Users },
    { name: 'Live Location', path: '/location', icon: Navigation, activeRadar: locationSession.isActive },
    { name: 'Safe Route', path: '/safe-route', icon: Route },
    { name: 'Fake Call', path: '/fake-call', icon: PhoneCall, indicator: isFakeCallScheduled ? `${fakeCallCountdown}s` : undefined },
    { name: 'Find Help', path: '/find-help', icon: LifeBuoy },
    { name: 'Report Incident', path: '/report', icon: FileWarning },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col">
      <DemoDisclaimerBanner />

      {/* Persistent Emergency Broadcast Ribbon if SOS is triggered */}
      {isSosActive && (
        <div className="bg-[#FF6B6B] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider sticky top-0 z-40 shadow-lg shadow-rose-950/60 animate-pulse">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>EMERGENCY SOS IS ACTIVE: Your location & emergency alerts are being broadcast.</span>
          </div>
          <button
            onClick={() => navigate('/sos')}
            className="px-3 py-1 rounded bg-black/30 hover:bg-black/40 text-white font-semibold text-[11px] shrink-0"
          >
            Manage Alert
          </button>
        </div>
      )}

      {/* App Topbar for mobile/desktop */}
      <header className="bg-[#1A1028]/95 backdrop-blur-md border-b border-[#30263D] sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-[#B8B5C9] hover:text-white hover:bg-white/5"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F43F6F] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
              Her<span className="text-[#F43F6F]">Shield</span>
            </span>
          </Link>

          {/* Current Safety Status Badge */}
          <div className="flex items-center gap-2 pl-2">
            {isSosActive ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-[#FF6B6B] border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-ping" />
                SOS Active
              </span>
            ) : locationSession.isActive ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-[#2DD4BF] border border-teal-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                Sharing Location
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-[#2DD4BF] border border-teal-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                You're Safe
              </span>
            )}
          </div>
        </div>

        {/* Topbar Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setQuickSosModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              isSosActive
                ? 'bg-[#FF6B6B] text-white shadow-lg shadow-rose-900/50 animate-pulse'
                : 'bg-rose-500/15 text-[#FF6B6B] hover:bg-rose-500/25 border border-rose-500/30'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden xs:inline">{isSosActive ? 'Active SOS' : 'Emergency SOS'}</span>
          </button>

          <Link
            to="/fake-call"
            className="p-2 rounded-xl text-[#B8B5C9] hover:text-white hover:bg-white/5 border border-transparent hover:border-[#30263D] transition-colors relative"
            title="Fake Call Escort"
          >
            <PhoneCall className="w-4 h-4" />
            {isFakeCallScheduled && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#A78BFA] rounded-full animate-ping" />
            )}
          </Link>

          <div className="h-4 w-px bg-[#30263D] mx-0.5 hidden sm:block" />

          {/* User mini badge */}
          <PWAInstallButton />
          
          <Link
            to="/settings"
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-[#30263D] text-[#B8B5C9] border border-[#453654] font-semibold text-xs flex items-center justify-center">
              {user?.name.charAt(0) || 'U'}
            </div>
            <span className="text-xs font-medium text-white hidden md:inline">{user?.name || 'Sophia'}</span>
          </Link>
        </div>
      </header>

      {/* Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-[#0E1528] border-r border-[#30263D] shrink-0 justify-between py-6 px-4">
          <div className="space-y-6">
            
            {/* Navigation links */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#B8B5C9]/60 px-3 tracking-wider">
                Safety Management
              </span>
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? item.danger
                          ? 'bg-rose-500/20 text-[#FF6B6B] border border-rose-500/30 font-semibold'
                          : 'bg-[#A78BFA]/15 text-white border border-[#A78BFA]/25 font-semibold'
                        : item.danger
                        ? 'text-[#FF6B6B] hover:bg-rose-500/10'
                        : 'text-[#B8B5C9] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.danger ? 'text-[#FF6B6B]' : 'text-[#A78BFA]'}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.indicator && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#A78BFA] text-[#0B1020]">
                        {item.indicator}
                      </span>
                    )}

                    {item.activeRadar && (
                      <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom links */}
          <div className="pt-4 border-t border-[#30263D] space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#B8B5C9] hover:text-white hover:bg-white/5 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Main Website</span>
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer (Left flyout) */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-[#1A1028] border-r border-[#30263D] p-5 flex flex-col justify-between z-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#30263D] pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#F43F6F]" />
                    <span className="font-bold text-white text-base">HerShield Security</span>
                  </div>
                  <button 
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-lg text-[#B8B5C9] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {mainNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm ${
                          isActive
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-[#B8B5C9] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${item.danger ? 'text-[#FF6B6B]' : 'text-[#A78BFA]'}`} />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#30263D] space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#B8B5C9] hover:text-white"
                >
                  <Home className="w-4 h-4" />
                  <span>Main Website Home</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          {children || <Outlet />}
        </main>
      </div>

      {/* Global Interactive Overlays */}
      <SosModal />
      <FakeCallOverlay />
      <NotificationToast />
      <OfflineIndicator />

      {/* Mobile Bottom Navigation Bar (Thumb reachable) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1A1028]/95 backdrop-blur-md border-t border-[#30263D] px-2 py-1.5 flex items-center justify-around">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition-colors ${
            location.pathname === '/dashboard' ? 'text-white font-bold' : 'text-[#B8B5C9]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/location"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition-colors relative ${
            location.pathname === '/location' ? 'text-[#2DD4BF] font-bold' : 'text-[#B8B5C9]'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Location</span>
          {locationSession.isActive && (
            <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#2DD4BF] rounded-full animate-ping" />
          )}
        </Link>

        {/* Centered elevated Emergency SOS button */}
        <button
          onClick={() => setQuickSosModalOpen(true)}
          className={`-mt-5 w-12 h-12 rounded-full flex flex-col items-center justify-center text-white shadow-lg cursor-pointer ${
            isSosActive
              ? 'bg-[#FF6B6B] animate-pulse ring-2 ring-rose-500/40'
              : 'bg-[#F43F6F] hover:bg-[#e03360] active:scale-95 transition-transform'
          }`}
          aria-label="Emergency SOS"
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[8px] font-bold tracking-wider uppercase mt-0.5">SOS</span>
        </button>

        <Link
          to="/find-help"
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition-colors ${
            location.pathname === '/find-help' ? 'text-white font-bold' : 'text-[#B8B5C9]'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Help</span>
        </Link>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium text-[#B8B5C9] hover:text-white"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
};
