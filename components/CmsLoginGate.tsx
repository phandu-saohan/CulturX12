'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Eye, EyeOff, AlertCircle, Loader2, Mail, KeyRound, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CmsLoginGateProps {
  onLoginSuccess: () => void;
}

type ViewMode = 'login' | 'reset';

export default function CmsLoginGate({ onLoginSuccess }: CmsLoginGateProps) {
  const [view, setView] = useState<ViewMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Please verify your email address before logging in.');
      } else {
        setError(authError.message);
      }
      return;
    }

    onLoginSuccess();
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your admin email address.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/cms/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-indigo-900/10 blur-[100px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <p className="text-[10px] text-brand-gold/60 uppercase tracking-[6px] font-mono font-bold">
            Secure Access Portal
          </p>
          <h1 className="text-3xl font-black tracking-[5px] text-brand-gold font-display uppercase">
            CULTURX™
          </h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">
            CMS Core — Admin Authentication
          </p>
        </div>

        {/* Card */}
        <div className="bg-neutral-950 border border-brand-line/60 rounded-2xl p-8 shadow-2xl shadow-black/60 space-y-6">
          
          {/* View: Login */}
          {view === 'login' && (
            <>
              <div className="flex items-center space-x-3 border-b border-neutral-900 pb-4">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-line flex items-center justify-center">
                  <LogIn className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Admin Sign In</h2>
                  <p className="text-[10px] text-zinc-500">Enter your CulturX admin credentials</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold flex items-center space-x-1.5">
                    <Mail className="w-3 h-3" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@culturx.com.au"
                    autoComplete="email"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-brand-gold/70 focus:ring-1 focus:ring-brand-gold/30 transition font-sans"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold flex items-center space-x-1.5">
                    <KeyRound className="w-3 h-3" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-brand-gold/70 focus:ring-1 focus:ring-brand-gold/30 transition font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-2 text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl px-4 py-3"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{error}</span>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-gold text-brand-black text-xs font-extrabold uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Access CMS Dashboard</span>
                    </>
                  )}
                </button>
              </form>

              {/* Forgot password */}
              <div className="text-center pt-2 border-t border-neutral-900">
                <button
                  onClick={() => { setView('reset'); setError(null); }}
                  className="text-[11px] text-zinc-500 hover:text-brand-gold transition underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {/* View: Password Reset */}
          {view === 'reset' && (
            <>
              <div className="flex items-center space-x-3 border-b border-neutral-900 pb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-900/30 border border-indigo-800/50 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Reset Password</h2>
                  <p className="text-[10px] text-zinc-500">We'll send a reset link to your email</p>
                </div>
              </div>

              {resetSent ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-14 h-14 rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Reset link sent!</p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Check your inbox at <span className="text-brand-gold">{email}</span> for the reset link.
                    </p>
                  </div>
                  <button
                    onClick={() => { setView('login'); setResetSent(false); setError(null); }}
                    className="text-[11px] text-zinc-500 hover:text-brand-gold transition"
                  >
                    ← Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold flex items-center space-x-1.5">
                      <Mail className="w-3 h-3" />
                      <span>Admin Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@culturx.com.au"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-brand-gold/70 focus:ring-1 focus:ring-brand-gold/30 transition"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-2 text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{error}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition disabled:opacity-60 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setView('login'); setError(null); }}
                      className="text-[11px] text-zinc-500 hover:text-brand-gold transition"
                    >
                      ← Back to login
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer notice */}
        <p className="text-center text-[10px] text-zinc-700 mt-6 font-mono uppercase tracking-widest">
          CulturX™ Secure Admin Portal · Authorized Access Only
        </p>
      </motion.div>
    </div>
  );
}
