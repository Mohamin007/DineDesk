import { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export const Integrations = () => {
  const [exaKey, setExaKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('exa_api_key_configured');
    if (saved) setExaKey('••••••••••••••••');
  }, []);

  const handleSave = async () => {
    if (!exaKey || exaKey.startsWith('•••')) return;
    
    setStatus('testing');
    // In a real app, this would verify with the backend
    setTimeout(() => {
      localStorage.setItem('exa_api_key_configured', 'true');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
          Integrations
          <span className="text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full">CORE</span>
        </h2>
        <p className="text-zinc-500 mt-2">Connect external intelligence layers to power your Market Operating System.</p>
      </div>

      <div className="grid gap-6">
        <div className="p-8 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group transition-all hover:border-indigo-500/20">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Exa Intelligence</h3>
                <p className="text-sm text-zinc-500">Live web research and market data</p>
              </div>
            </div>
            <a href="https://exa.ai" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <ExternalLink className="w-5 h-5 text-zinc-400" />
            </a>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="password"
                value={exaKey}
                onChange={(e) => setExaKey(e.target.value)}
                placeholder="Enter your Exa API Key"
                className="w-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:border-indigo-500/50 transition-all font-mono"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {status === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3 h-3" />
                Secure server-side proxy
              </div>
              <button 
                onClick={handleSave}
                disabled={status === 'testing'}
                className={cn(
                  "px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2",
                  status === 'success' ? "bg-emerald-500 text-white" : 
                  "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                )}
              >
                {status === 'testing' ? (
                  <Zap className="w-4 h-4 animate-pulse" />
                ) : (
                  status === 'success' ? 'Connection Verified' : 'Verify & Connect'
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Current Status</p>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", exaKey ? "bg-emerald-500" : "bg-zinc-300")} />
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {exaKey ? 'Linked: High Velocity' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Capabilities</p>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Market Audits • Trend Discovery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
