import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Globe, 
  Instagram, 
  Target,
  Sparkles,
  RefreshCcw,
  Zap,
  Brain,
  Video,
  Users,
  Smartphone,
  Eye,
  ArrowRight,
  BarChart3,
  Search,
  MessageSquare,
  Activity,
  ShieldCheck,
  Radar,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { aiService, MarketIntelligence } from '@/services/aiService';

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">{title}</h3>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
  </div>
);

const TrendCard = ({ title, description, momentum, idx }: { title: string, description: string, momentum: string, idx: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1 }}
    className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors uppercase leading-tight">{title}</h4>
      <div className={cn(
        "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
        momentum === 'high' ? "bg-emerald-500/10 text-emerald-500" :
        momentum === 'medium' ? "bg-orange-500/10 text-orange-500" :
        "bg-zinc-500/10 text-zinc-500"
      )}>
        {momentum} Momentum
      </div>
    </div>
    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const IntelligenceGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

export const MarketTrends = () => {
  const [intel, setIntel] = useState<MarketIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const fetchIntelligence = async (force: boolean = false) => {
    setLoading(true);
    if (force || !intel) {
      setScanStep(0);
      
      // Simulating neural scan phases for UX
      const steps = ["Initializing Exa Search Proxy", "Scanning Social Velocity", "Processing Groq Llama-3 Reasoning", "Synthesizing Growth Directive"];
      
      for (let i = 0; i < steps.length; i++) {
        setScanStep(i);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    try {
      const data = await aiService.getTrends("Local Area", force);
      setIntel(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have intel already
    const checkCache = async () => {
      const existing = await aiService.getTrends();
      if (existing.neuralHighlights && existing.neuralHighlights.length > 0) {
        setIntel(existing);
      } else {
        fetchIntelligence(false);
      }
    };
    checkCache();
  }, []);

  const loadingSteps = [
    "Initializing Exa Search Proxy",
    "Scanning Social Velocity",
    "Processing Groq Llama-3 Reasoning",
    "Synthesizing Growth Directive"
  ];

  return (
    <div className="p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-(--breakpoint-2xl) mx-auto pb-32">
      {/* Header Intelligence Terminal */}
      <div className="lg:flex justify-between items-end gap-8 space-y-8 lg:space-y-0 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white ring-2 ring-white dark:ring-zinc-900 border border-indigo-600">
                <Brain className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white ring-2 ring-white dark:ring-zinc-900 border border-orange-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] animate-pulse">Neural Market Scanner v5.0</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.9]">
            Strategic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500">
              Intelligence
            </span>
          </h2>
          <p className="text-zinc-500 mt-6 max-w-lg text-lg font-medium leading-relaxed">
            Continuously analyzing food trends, customer psychology, and social-first brand opportunities.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => fetchIntelligence(true)}
            disabled={loading}
            className="group relative px-8 py-4 rounded-3xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Radar className="w-5 h-5" />}
            Refresh Neural Scan
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh] flex flex-col items-center justify-center space-y-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-48 h-48 border-4 border-black/5 dark:border-white/5 rounded-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 animate-ping" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-4 border-t-indigo-500 border-indigo-500/10 rounded-full"
                />
                <Brain className="w-16 h-16 text-indigo-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-4 text-center">
              <p className="text-xl font-black text-zinc-900 dark:text-white tracking-widest uppercase">Analyzing Market Volatility</p>
              <div className="flex flex-col items-center gap-3">
                {loadingSteps.map((step, i) => (
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: scanStep === i ? 1 : scanStep > i ? 0.4 : 0,
                      y: 0 
                    }}
                    className={cn(
                      "flex items-center gap-3 text-xs font-bold uppercase tracking-widest",
                      scanStep === i ? "text-indigo-500" : "text-zinc-400"
                    )}
                  >
                    {scanStep > i ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : intel ? (
          <motion.div 
            key="intel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-24"
          >
            {/* Neural Highlights Marquee-style */}
            <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Brain className="w-64 h-64" />
              </div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    <h3 className="text-3xl font-black tracking-tighter uppercase">Neural Scan Highlights</h3>
                  </div>
                  <div className="space-y-6">
                    {intel.neuralHighlights.map((highlight, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                        <p className="text-xl font-medium leading-relaxed italic opacity-90">{highlight}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 flex flex-col justify-between min-h-[300px]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Intelligence Confidence</p>
                    <h4 className="text-7xl font-black tracking-tighter">{intel.confidenceScore}%</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span>Signal Integrity</span>
                      <span className="text-emerald-400">Stable</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${intel.confidenceScore}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Food + Menu Trends Section */}
            <section>
              <SectionHeader 
                icon={Flame} 
                title="Food + Menu Velocity" 
                subtitle="Viral concepts & trending ingredients" 
              />
              <IntelligenceGrid>
                {intel.foodTrends.map((trend, i) => (
                  <TrendCard key={i} {...trend} idx={i} />
                ))}
              </IntelligenceGrid>
            </section>

            {/* Digital Experience Section */}
            <section>
              <SectionHeader 
                icon={Smartphone} 
                title="Digital Experience Intel" 
                subtitle="Website ROI & customer engagement trends" 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {intel.digitalExperience.map((exp, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     className="p-6 rounded-3xl bg-indigo-500 text-white shadow-xl flex flex-col justify-between"
                   >
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Globe className="w-5 h-5" />
                        </div>
                        <h4 className="font-black leading-tight uppercase text-sm">{exp.feature}</h4>
                        <p className="text-[10px] opacity-80 leading-relaxed font-medium">{exp.impact}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Directive</p>
                        <p className="text-[10px] font-bold">{exp.recommendation}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
            </section>

            {/* Social Media + Digital Growth Section */}
            <section>
              <SectionHeader 
                icon={Instagram} 
                title="Social Growth Intelligence" 
                subtitle="Short-form content & engagement tactics" 
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {intel.digitalIntelligence.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-10 rounded-[3rem] bg-zinc-900 text-white relative overflow-hidden group shadow-xl"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                      <Video className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-rose-500 rounded-full text-[8px] font-black uppercase tracking-widest">{item.platform}</span>
                        <h4 className="text-2xl font-black tracking-tight">{item.title}</h4>
                      </div>
                      <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                        {item.insight}
                      </p>
                      <div className="mt-8 flex items-center text-xs font-black uppercase tracking-widest text-indigo-400 gap-2 cursor-pointer hover:gap-4 transition-all">
                        Implement Content Strategy <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Customer Psychology Section */}
            <section>
              <SectionHeader 
                icon={Users} 
                title="Customer Psychology Scan" 
                subtitle="Gen Z behavior & aesthetic preferences" 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {intel.customerPsychology.map((item, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10 flex gap-6 group hover:bg-orange-500/10 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <h4 className="text-xl font-black text-zinc-900 dark:text-white uppercase leading-tight">{item.title}</h4>
                           <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{item.segment}</span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                          "{item.description}"
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Market Positioning Section */}
            <section>
              <SectionHeader 
                icon={Radar} 
                title="Market Positioning" 
                subtitle="Competitor gaps & premium opportunities" 
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {intel.marketPositioning.map((item, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-800/20 border border-black/5 dark:border-white/5 flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="text-xl font-black text-zinc-900 dark:text-white uppercase leading-tight">{item.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Opportunity Rank: High</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Strategic Actions Engine */}
            <section className="bg-zinc-900 rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
               <div className="absolute top-0 right-0 p-20 opacity-5">
                  <Target className="w-96 h-96" />
               </div>
               <div className="relative z-10 max-w-4xl">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-16 h-16 rounded-[2rem] bg-indigo-500 flex items-center justify-center text-white">
                      <Zap className="w-8 h-8 fill-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Growth Strategy Engine</h3>
                      <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Neural Growth Directives</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {intel.strategicActions.map((action, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="flex gap-6 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02]"
                        >
                           <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-600/50 flex items-center justify-center text-indigo-400 font-black">
                              {i + 1}
                           </div>
                           <div className="space-y-4">
                              <h4 className="text-xl font-black tracking-tight leading-tight">{action.action}</h4>
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Impact: {action.impact}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Target className="w-3 h-3 text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Target: {action.target}</span>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>
          </motion.div>
        ) : (
          <div className="min-h-[40vh] flex items-center justify-center">
             <button onClick={() => fetchIntelligence(true)} className="px-10 py-5 rounded-3xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-2xl">
               Start Intelligence Scan
             </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
