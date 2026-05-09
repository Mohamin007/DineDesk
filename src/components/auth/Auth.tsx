/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Zap, 
  Chrome,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Mail,
  Lock,
  User,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export const Auth = ({ mode: initialMode, onFinish }: { mode: 'signin' | 'signup', onFinish: () => void }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('[Auth] Initiating Google Sign-In');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('[Auth] Google Sign-In Success:', result.user.email);
      onFinish();
    } catch (err: any) {
      console.error('[Auth] Google Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-In cancelled.');
      } else {
        setError('Authentication service unavailable.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log('[Auth] Initiating Demo Login');

    // Frictionless Demo Login Implementation
    setTimeout(() => {
      try {
        const demoUser = {
          displayName: fullName || email.split('@')[0] || 'Demo User',
          email: email.includes('@') ? email : `${email}@demo.local`,
          isDemo: true,
          photoURL: null
        };
        
        sessionStorage.setItem('demo_user', JSON.stringify(demoUser));
        console.log('[Auth] Demo User Created & Persisted to session:', demoUser.email);
        setIsLoading(false);
        onFinish();
      } catch (err) {
        console.error('[Auth] Demo login failure:', err);
        setError('Failed to initialize demo session.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      {/* Left Side: Brand & Visuals */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter" id="brand-logo">DineDesk</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter leading-none mb-8">
            The Future of <br />
            Hospitality. <br />
            <span className="text-zinc-500">Fully Automated.</span>
          </h2>
        </div>

        <div className="relative z-10">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
             <p className="text-zinc-400 text-sm italic mb-4">
               "DineDesk AI didn't just replace our POS; it replaced our entire operations team. We've seen a 30% increase in profit within 2 months."
             </p>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-500" />
               <div>
                 <p className="text-xs font-bold">Mohamin & Hanaan</p>
                 <p className="text-[10px] text-zinc-500 uppercase font-mono">Founder • Vane Group</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-[0.8] flex flex-col justify-center items-center p-8 md:p-20 z-10">
        <div className="max-w-md w-full space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-500 animate-pulse md:hidden mb-8">
              <Zap className="w-8 h-8 fill-orange-500" />
              <span className="text-2xl font-black tracking-tighter">DineDesk</span>
            </div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
              {mode === 'signin' ? 'Welcome Back' : 'Join the Ecosystem'}
            </h1>
            <p className="text-zinc-500 font-medium">
               {mode === 'signin' ? 'Access your neural control center.' : 'No configuration needed. Instant demo access available.'}
            </p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
            >
              <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5 dark:border-white/5" /></div>
              <span className="relative px-4 bg-white dark:bg-[#0A0A0B] text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Or Use Demo Credentials</span>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wider"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 text-zinc-400 focus-within:border-orange-500/50 transition-all">
                    <User className="w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full" 
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email or Username</label>
                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 text-zinc-400 focus-within:border-orange-500/50 transition-all">
                  <Mail className="w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="demo@restaurant.com" 
                    className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 text-zinc-400 focus-within:border-orange-500/50 transition-all">
                  <Lock className="w-4 h-4" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 font-medium leading-normal">
                  <span className="text-orange-500 font-bold uppercase tracking-tighter">Demo Mode Enabled:</span> Use any email and password combination to explore the dashboard instantly.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    {mode === 'signin' ? 'Enter Dashboard' : 'Explore Platform'} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="w-full text-center text-sm font-bold text-zinc-500 hover:text-orange-500 transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

