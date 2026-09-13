import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConfigured) {
      setError('Firebase authentication is not configured. Please set environment variables.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!pin.trim() || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('Emergency SOS PIN must be exactly 4 numeric digits.');
      return;
    }

    if (pin !== confirmPin) {
      setError('Emergency SOS PIN entries do not match.');
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the terms of service to create an account.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signUp(email, password, name);

      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      if (res.session && res.user) {
        try {
          await apiRequest('/api/profile', {
            method: 'PUT',
            body: JSON.stringify({ emergency_pin: pin })
          });
        } catch (pinErr: any) {
          console.warn('[Signup] Failed to persist emergency PIN:', pinErr);
        }
      }

      if (res.requiresEmailConfirmation) {
        // Email confirmation is required by Firebase
        // Do not automatically claim user is logged in
        setConfirmationSent(true);
      } else if (res.session && res.user) {
        // Immediate login
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#F43F6F] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Her<span className="text-[#F43F6F]">Shield</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white pt-2">Create Safety Account</h1>
          <p className="text-xs text-[#B8B5C9]">
            Register your secure account protected by Firebase Auth.
          </p>
        </div>

        {/* Missing Firebase Configuration Notice */}
        {!isConfigured && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>Firebase Configuration Required</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-200/90">
              Registration requires connecting to your Firebase project. Add the following keys to your environment (<code className="bg-black/30 px-1 py-0.5 rounded font-mono">.env</code> or Settings):
            </p>
            <div className="font-mono text-[11px] bg-black/40 p-2.5 rounded-xl space-y-1 text-amber-100 border border-amber-500/20">
              <div>VITE_FIREBASE_API_KEY=&lt;your-api-key&gt;</div>
              <div>VITE_FIREBASE_PROJECT_ID=&lt;your-project-id&gt;</div>
            </div>
          </div>
        )}

        {confirmationSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center mx-auto border border-teal-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Verification Email Sent</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                We've dispatched a confirmation link to <strong className="text-white">{email}</strong>. Please click the link in your email to activate your account before signing in.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full py-3 rounded-lg font-bold text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm text-xs inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9] block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sophia Chen"
                    className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9] block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sophia@example.com"
                    className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9] block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create strong password (min. 6 characters)"
                    className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9] block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#30263D] space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#B8B5C9] block">Emergency SOS PIN (4-Digit)</label>
                  <p className="text-[11px] text-[#B8B5C9]/80 leading-relaxed">This PIN is required to turn off an active SOS.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="4-digit PIN"
                      className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-3 text-center text-base tracking-widest font-mono text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Confirm PIN"
                      className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-3 text-center text-base tracking-widest font-mono text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs text-[#B8B5C9]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="rounded border-[#30263D] text-[#F43F6F] focus:ring-0 bg-[#0B1020] mt-0.5"
                  />
                  <span className="leading-tight">
                    I accept the Emergency Terms of Service and Privacy Guarantee.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isConfigured}
                className="w-full py-3 rounded-lg font-bold text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Account Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-[#B8B5C9]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#A78BFA] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
};
