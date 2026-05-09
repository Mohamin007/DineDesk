import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Package, 
  BarChart4, 
  ChevronRight,
  RefreshCcw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { aiService } from '@/services/aiService';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'inventory' | 'market' | 'revenue' | 'strategic';
  severity: 'critical' | 'warning' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  actionText: string;
  impact: 'High' | 'Medium' | 'Low';
}

const TYPE_CONFIG = {
  inventory: { icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  market: { icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  revenue: { icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  strategic: { icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-500/10' }
};

const SEVERITY_CONFIG = {
  critical: 'bg-rose-500 text-white shadow-lg shadow-rose-500/20',
  warning: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20',
  opportunity: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
};

export const PredictiveAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await aiService.getPredictiveAlerts();
      setAlerts(data);
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300000); // 5 minutes refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter dark:text-white uppercase italic">
              AI Alert Center
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Proactive Tactical Feed
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Last Scan: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchAlerts}
            disabled={loading}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 hover:border-indigo-500/30 transition-all group"
          >
            <RefreshCcw className={cn("w-5 h-5 text-zinc-400", loading && "animate-spin")} />
          </button>
          <div className="px-6 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" />
            Intel Verified
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {loading && alerts.length === 0 ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-64 rounded-[2.5rem] bg-zinc-100 dark:bg-white/5 animate-pulse" />
            ))
          ) : alerts.length > 0 ? (
            alerts.map((alert, i) => {
              const Config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.strategic;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                  
                  <article className="relative h-full p-8 lg:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/[0.03] dark:border-white/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col gap-8">
                    <div className="flex justify-between items-start">
                      <div className={cn("p-4 rounded-2xl", Config.bg, Config.color)}>
                        <Config.icon className="w-6 h-6" />
                      </div>
                      <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", SEVERITY_CONFIG[alert.severity])}>
                        {alert.severity}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-black dark:text-white leading-tight uppercase tracking-tight">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-zinc-500 font-medium leading-[1.6]">
                        {alert.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Confidence Index</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${alert.confidence}%` }}
                              className="h-full bg-indigo-600"
                            />
                          </div>
                          <span className="text-xs font-black text-indigo-600">{alert.confidence}%</span>
                        </div>
                      </div>

                      <button className="flex items-center gap-2 group/btn text-[11px] font-black uppercase tracking-[0.15em] text-zinc-900 dark:text-white px-6 py-3 bg-zinc-50 dark:bg-white/5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                        {alert.actionText}
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </article>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase">Intelligence Stable</h3>
              <p className="text-zinc-500 max-w-sm font-medium">No critical risks detected. Operations currently optimized within strategic parameters.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Proactive Meta Layer */}
      <div className="p-10 rounded-[3rem] bg-indigo-600/5 border border-indigo-600/10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
        <div className="shrink-0 p-5 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl relative">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full animate-ping" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600">Active Strategic Monitoring</h4>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-2xl">
            Our predictive engine continuously synthesizes your restaurant's performance telemetry with regional industry shifts. Alerts are processed through Llama-3.3-70b-Versatile reasoning to ensure tactical precision.
          </p>
        </div>
        <button className="px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">
          Intel Settings
        </button>
      </div>
    </div>
  );
};
