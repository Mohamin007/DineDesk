import { useState, useEffect } from 'react';
import { 
  Zap, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  PlusCircle,
  X,
  ChevronRight,
  Target,
  ArrowUpRight,
  Globe,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { aiService } from '@/services/aiService';

interface Combo {
  title: string;
  items: string[];
  strategy: string;
  estimatedAOVIncrease: string;
  confidence: number;
  type: 'food-drink' | 'food-side' | 'bundle';
}

interface NewOpportunity {
  item: string;
  reason: string;
  trendSource: string;
}

interface ComboData {
  combos: Combo[];
  newOpportunities: NewOpportunity[];
  marketInsights: string[];
}

export const ComboSuggestions = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ComboData | null>(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await aiService.ask(
          'Generate high-revenue smart combo suggestions.',
          'combo-suggestions'
        );
        const parsed = JSON.parse(response);
        setData(parsed);
      } catch (error) {
        console.error('Combo analysis failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              Smart Combo Suggestions
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
              Revenue Optimization Engine v2.1
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
            <div className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">AI Confidence</p>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-indigo-500 rounded-full" />
                    <span className="text-xs font-bold text-indigo-500">94.8%</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-12 max-w-md mx-auto text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="relative w-32 h-32 border-4 border-black/5 dark:border-white/5 border-t-indigo-500 rounded-full flex items-center justify-center"
                >
                    <ShoppingBag className="w-12 h-12 text-indigo-500 animate-bounce" />
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Analyzing Revenue Pairs...</h3>
                <div className="space-y-3">
                    {[
                        { icon: Globe, label: 'Scanning Global Pairing Trends' },
                        { icon: BarChart3, label: 'Calculating AOV Optimization Matrix' },
                        { icon: Sparkles, label: 'Groq Recommendation Cycle Active' }
                    ].map((step, i) => (
                        <motion.div 
                            key={step.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.8 }}
                            className="flex items-center gap-3 text-xs font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            <step.icon className="w-4 h-4 text-indigo-500" />
                            {step.label}
                        </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          ) : data && (
            <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-12 pb-24"
            >
              {/* Market Intelligence Ribbon */}
              <div className="flex flex-wrap gap-4">
                {data.marketInsights.map((insight, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-3"
                    >
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{insight}</p>
                    </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Combo Grid */}
                <div className="lg:col-span-8 space-y-8">
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight px-2">Top Combo Opportunities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.combos.map((combo, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm group hover:shadow-2xl hover:border-indigo-500/20 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {combo.type}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase">High Yield</span>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">{combo.title}</h4>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {combo.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-zinc-500 bg-black/5 dark:bg-white/5 px-3 py-2 rounded-xl">
                                                <Target className="w-3 h-3 text-indigo-500" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-xs text-zinc-500 leading-relaxed italic">
                                        "{combo.strategy}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Impact Potential</p>
                                        <span className="text-lg font-black text-emerald-500">{combo.estimatedAOVIncrease}</span>
                                    </div>
                                    <button className="p-4 rounded-2xl bg-black dark:bg-white dark:text-zinc-900 text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: New Item Opportunities */}
                <div className="lg:col-span-4 space-y-8">
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight px-2">Expansion Intel</h3>
                    <div className="space-y-6">
                        {data.newOpportunities.map((opp, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <PlusCircle className="w-32 h-32" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-white/60" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">New Growth Vector</p>
                                    </div>
                                    <h5 className="text-xl font-black tracking-tight">{opp.item}</h5>
                                    <p className="text-sm font-medium text-white/80 leading-relaxed">
                                        {opp.reason}
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase text-white/40 tracking-tighter">
                                        <ChevronRight className="w-3 h-3" />
                                        Market Signal: {opp.trendSource}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white border border-white/10 shadow-2xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h4 className="text-lg font-black">AI Revenue Pilot</h4>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Our neural engine suggests launching these combinations during your peak occupancy periods (Fri-Sun 18:00 - 21:00) to maximize AOV uplift.
                            </p>
                            <button className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                                Deploy Combo Campaign
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
