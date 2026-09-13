import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowRight, CheckCircle2, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPassword: React.FC = () => {
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConfigured) {
      setError('Firebase authentication is not configured. Please set environment variables.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPassword(email);
      if (!res.success) {
        setError(res.error || res.message || 'Failed to dispatch password recovery email.');
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
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
          <h1 className="text-xl font-bold text-white pt-2">Reset Account Password</h1>
          <p className="text-xs text-[#B8B5C9]">
            Enter your registered email address to receive password recovery instructions.
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
              Password reset requires connecting to your Firebase project. Add the following keys to your environment (<code className="bg-black/30 px-1 py-0.5 rounded font-mono">.env</code> or Settings):
            </p>
            <div className="font-mono text-[11px] bg-black/40 p-2.5 rounded-xl space-y-1 text-amber-100 border border-amber-500/20">
              <div>VITE_FIREBASE_API_KEY=&lt;your-api-key&gt;</div>
              <div>VITE_FIREBASE_PROJECT_ID=&lt;your-project-id&gt;</div>
            </div>
          </div>
        )}

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center mx-auto border border-teal-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Recovery Email Dispatched</h3>
              <p className="text-xs text-[#B8B5C9] leading-relaxed">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive an email with instructions on how to reset your password.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#A78BFA] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Sign In
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8B5C9] block">Registered Email Address</label>
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

              <button
                type="submit"
                disabled={isLoading || !isConfigured}
                className="w-full py-3 rounded-lg font-bold text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Dispatching Instructions...' : 'Send Recovery Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-[#B8B5C9] hover:text-white inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
