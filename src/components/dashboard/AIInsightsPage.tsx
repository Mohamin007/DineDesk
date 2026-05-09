import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  RefreshCcw, 
  BrainCircuit,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { aiService, AIInsight } from '@/services/aiService';
import { cn } from '@/lib/utils';

export const AIInsightsPage = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const data = await aiService.getInsights();
    setInsights(data.insights);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-(--breakpoint-xl) mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <BrainCircuit className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Neural Copilot Engine v4.0</span>
          </div>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-2">
            Intelligent Business Insights
          </h2>
          <p className="text-zinc-500 max-w-lg">
            Our AI analysis engine processes real-time sales, inventory, and external market signals to help you dominate your local scene.
          </p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Refresh Neural State
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-white/5 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight, i) => (
            <motion.div
              key={`${insight.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-white dark:bg-[#111113] border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-all relative overflow-hidden shadow-sm dark:shadow-none"
            >
              <div className="absolute top-0 right-0 p-4">
                 <div className={cn(
                   "w-2 h-2 rounded-full",
                   insight.impact === 'high' ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]" : "bg-orange-500"
                 )} />
              </div>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  {insight.type === 'prediction' && <TrendingUp className="w-6 h-6" />}
                  {insight.type === 'optimization' && <Lightbulb className="w-6 h-6" />}
                  {insight.type === 'alert' && <ShieldAlert className="w-6 h-6" />}
                  {insight.type === 'trend' && <Zap className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{insight.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  {insight.description}
                </p>
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 uppercase font-mono">Confidence Level</span>
                  <span className="text-zinc-900 dark:text-white font-bold">{(insight.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${insight.confidence * 100}%` }} 
                  />
                </div>
                <button className="w-full py-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  Take Suggested Action <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Strategic Summary Area */}
      <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 via-indigo-900/10 to-white dark:from-indigo-900/40 dark:to-black border border-black/5 dark:border-white/5 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 p-10 opacity-5 dark:opacity-10">
          <BrainCircuit className="w-64 h-64 text-indigo-900 dark:text-white" />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">The DineDesk Advantage</h3>
            <ul className="space-y-4">
              {[
                "Real-time external weather API integration for demand spikes",
                "Advanced inventory wastage patterns using historical decay curves",
                "Social sentiment analysis on menu popularity"
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                  <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-widest text-center">System Reliability</h4>
            <div className="flex justify-around">
               {[
                 { label: 'Data Latency', val: '12ms' },
                 { label: 'Analysis Speed', val: '0.8s' },
                 { label: 'Uptime', val: '99.9%' },
               ].map((stat, i) => (
                 <div key={i} className="text-center">
                   <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.val}</p>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
