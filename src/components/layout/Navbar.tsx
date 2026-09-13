import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';
import { Shield, ShieldAlert, Menu, X, ArrowRight, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isSosActive, setQuickSosModalOpen } = useSafety();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Safety Resources', path: '/resources' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isAppRoute = location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/contacts') || 
                     location.pathname.startsWith('/location') || 
                     location.pathname.startsWith('/safe-route') || 
                     location.pathname.startsWith('/fake-call') || 
                     location.pathname.startsWith('/find-help') || 
                     location.pathname.startsWith('/report') || 
                     location.pathname.startsWith('/settings') ||
                     location.pathname === '/sos';

  return (
    <nav className="sticky top-0 z-40 bg-[#0B1020]/95 backdrop-blur-md border-b border-[#30263D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#F43F6F] flex items-center justify-center text-white shadow-sm transition-opacity group-hover:opacity-90">
              {/* Shield + subtle protection motif */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M9 14c0-1.66 1.34-3 3-3s3 1.34 3 3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Her<span className="text-[#F43F6F]">Shield</span>
              </span>
              <span className="text-[10px] text-[#B8B5C9] font-medium tracking-wide uppercase -mt-1 hidden sm:inline">
                Personal Security
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-[#B8B5C9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Emergency SOS Trigger Button */}
            <button
              onClick={() => setQuickSosModalOpen(true)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                isSosActive
                  ? 'bg-[#FF6B6B] text-white animate-pulse shadow-lg shadow-rose-900/50'
                  : 'bg-rose-500/15 text-[#FF6B6B] hover:bg-rose-500/25 border border-rose-500/30'
              }`}
              aria-label="Emergency SOS"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSosActive ? 'SOS ACTIVE' : 'SOS'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isAppRoute 
                      ? 'bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/30' 
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#B8B5C9] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#F43F6F] text-white hover:bg-[#e03360] transition-colors flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger & SOS */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setQuickSosModalOpen(true)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                isSosActive ? 'bg-[#FF6B6B] text-white animate-pulse' : 'bg-rose-500/20 text-[#FF6B6B]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              SOS
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#B8B5C9] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1028] border-b border-[#30263D] px-4 pt-2 pb-6 space-y-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-white bg-white/10'
                    : 'text-[#B8B5C9] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#30263D] space-y-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#F43F6F] text-white font-semibold text-center flex items-center justify-center gap-2 hover:bg-[#e03360] transition-colors"
              >
                Open Safety Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2 text-center rounded-lg border border-[#30263D] text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center rounded-lg bg-[#F43F6F] text-white font-semibold hover:bg-[#e03360] transition-colors"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
