import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, KeyRound, ExternalLink } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, isConfigured } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const target = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConfigured) {
      setError('Firebase authentication is not configured. Please set environment variables.');
      return;
    }

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      if (res.session && res.user) {
        const target = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(target, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication encountered an unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-[#F43F6F] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Her<span className="text-[#F43F6F]">Shield</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white pt-2">Sign In to Your Safety Account</h1>
          <p className="text-xs text-[#B8B5C9]">
            Secure, encrypted authentication powered by Firebase Auth.
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
              Authentication requires connecting to your Firebase project. Add the following keys to your environment (<code className="bg-black/30 px-1 py-0.5 rounded font-mono">.env</code> or Settings):
            </p>
            <div className="font-mono text-[11px] bg-black/40 p-2.5 rounded-xl space-y-1 text-amber-100 border border-amber-500/20">
              <div>VITE_FIREBASE_API_KEY=&lt;your-api-key&gt;</div>
              <div>VITE_FIREBASE_PROJECT_ID=&lt;your-project-id&gt;</div>
            </div>
            <div className="text-[10px] text-amber-300/80 pt-1 flex items-center gap-1">
              <span>Find these under Firebase Console &rarr; Project Settings &rarr; API</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="name@example.com"
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#B8B5C9]">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#A78BFA] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#B8B5C9] hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isConfigured}
            className="w-full py-3 rounded-lg font-bold text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to HerShield'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#B8B5C9]">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-[#F43F6F] font-semibold hover:underline">
            Create Free Safety Account
          </Link>
        </p>

      </div>
    </div>
  );
};
