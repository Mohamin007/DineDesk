import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Target,
  Globe,
  Users,
  Smartphone,
  Rocket,
  RefreshCcw,
  AlertCircle,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { aiService } from '@/services/aiService';
import { cn } from '@/lib/utils';

interface FutureProofData {
  overallScore: number;
  scores: {
    innovation: number;
    digital: number;
    alignment: number;
    genZ: number;
    growth: number;
  };
  verdict: string;
  pillars: {
    title: string;
    status: 'Ready' | 'Evolving' | 'Behind';
    analysis: string;
    opportunities: string[];
  }[];
  actionPlan: {
    title: string;
    impact: string;
    timeframe: string;
  }[];
}

export const FutureProofEngine: React.FC = () => {
  const [data, setData] = useState<FutureProofData | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const runNeuralScan = async () => {
    setLoading(true);
    setScanning(true);
    try {
      // Simulate real-time neural scan phases
      const result = await aiService.getFutureProofAnalysis();
      setData(result);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  useEffect(() => {
    if (!data && !loading) {
      runNeuralScan();
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-8 py-16 lg:px-12 lg:py-24 space-y-24">
        
        {/* Cinematic Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-black/[0.03] dark:border-white/[0.03] pb-16">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Neural Architecture Scan
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] dark:text-white">
              Future Readiness <span className="text-zinc-300 dark:text-zinc-800 italic">Engine</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium max-w-2xl leading-relaxed">
              Synthesizing market behavior, regional demand, and digital evolution markers to analyze your business's survivability in the 2025-2027 dining landscape.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 shrink-0 bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-3xl">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-zinc-100 dark:border-white/5 flex items-center justify-center relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-indigo-600/10"
                  animate={{ y: [0, 128, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-5xl font-black text-indigo-600">{data?.overallScore || '--'}</span>
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg">
                <BrainCircuit className="w-5 h-5" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Readiness Score</p>
              <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Sector: Premium Casual</p>
            </div>
            <button 
              onClick={runNeuralScan}
              disabled={loading}
              className="w-full py-4 px-8 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all outline-none"
            >
              <RefreshCcw className={cn("w-4 h-4", scanning && "animate-spin")} />
              Sync Neural Scan
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center space-y-12"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 border-2 border-indigo-600/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-4 border-2 border-indigo-600/40 rounded-full"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.4, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <BrainCircuit className="w-20 h-20 text-indigo-600 animate-pulse" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Analyzing Market Survival Vectors</h3>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      className="w-2 h-2 bg-indigo-600 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : data ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-32"
            >
              {/* Score Radar Table */}
              <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                <ScoreCard label="Innovation" value={data.scores.innovation} icon={Zap} />
                <ScoreCard label="Digital Footprint" value={data.scores.digital} icon={Smartphone} />
                <ScoreCard label="Market Alignment" value={data.scores.alignment} icon={Globe} />
                <ScoreCard label="Gen Z Appeal" value={data.scores.genZ} icon={Users} />
                <ScoreCard label="Scalability" value={data.scores.growth} icon={Rocket} />
              </section>

              {/* Core Verdict */}
              <section className="p-16 lg:p-24 rounded-[4rem] bg-indigo-600 text-white shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-110 transition-transform duration-1000">
                  <ShieldCheck className="w-96 h-96" />
                </div>
                <div className="relative space-y-12 max-w-5xl">
                   <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-[10px] font-black uppercase tracking-widest">
                     <AlertCircle className="w-4 h-4" />
                     Executive Readiness Verdict
                   </div>
                   <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight italic">
                     "{data.verdict}"
                   </h2>
                </div>
              </section>

              {/* Strategy Pillars */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {data.pillars.map((pillar, i) => (
                  <motion.div 
                    key={i}
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    viewport={{ once: true }}
                    className="p-12 rounded-[3.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-xl space-y-10 group"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{pillar.title}</h3>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                        pillar.status === 'Ready' ? "bg-emerald-500/10 text-emerald-500" : 
                        pillar.status === 'Evolving' ? "bg-indigo-500/10 text-indigo-500" : "bg-rose-500/10 text-rose-500"
                      )}>
                        {pillar.status}
                      </span>
                    </div>

                    <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium">
                      {pillar.analysis}
                    </p>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Strategic Upsides</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pillar.opportunities.map((opp, j) => (
                          <div key={j} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                             <ArrowUpRight className="w-4 h-4 text-indigo-500" />
                             {opp}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </section>

              {/* Execution Roadmap */}
              <section className="space-y-16">
                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter whitespace-nowrap">Tactical Convergence Plan</h2>
                  <div className="h-px w-full bg-black/[0.03] dark:bg-white/[0.03]" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {data.actionPlan.map((action, i) => (
                    <div key={i} className="p-10 rounded-[3rem] bg-zinc-900 dark:bg-zinc-800 text-white shadow-2xl relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-125 transition-transform duration-700">
                        <Rocket className="w-32 h-32" />
                      </div>
                      <div className="relative space-y-8">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-400/10 rounded-lg">
                            {action.timeframe} Priority
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{action.impact} Impact</span>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight leading-snug">{action.title}</h4>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white transition-colors">
                          Generate Workflow <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Trust Layer */}
              <div className="py-12 border-t border-black/[0.03] dark:border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black dark:text-white uppercase tracking-widest">FutureProof™ Protocol</h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Encrypted Strategic Assessment</p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest max-w-sm text-center md:text-right">
                  Scan generated via DineDesk Core Intelligence. Powered by Llama-3.3 Advanced Reasoning with Exa Market Grounding.
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="py-48 flex flex-col items-center justify-center space-y-8 text-center bg-white dark:bg-zinc-900 rounded-[4rem] border border-black/5 dark:border-white/5">
              <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600/5 flex items-center justify-center">
                 <ShieldCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Null Readiness Signal</h3>
                <p className="text-zinc-500 text-sm font-medium">Initialize future-readiness audit to verify sector survival potential.</p>
              </div>
              <button 
                onClick={runNeuralScan}
                className="px-12 py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
              >
                Launch Neural Scan
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ScoreCard = ({ label, value, icon: Icon }: { label: string, value: number, icon: any }) => (
  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/[0.03] dark:border-white/[0.03] shadow-sm flex flex-col gap-8 group hover:-translate-y-1 transition-all">
    <div className="flex justify-between items-center">
      <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-2xl group-hover:bg-indigo-600/10 transition-colors">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <span className="text-2xl font-black text-zinc-900 dark:text-white">{value}%</span>
    </div>
    <div className="space-y-4">
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
      <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          className="h-full bg-indigo-600"
        />
      </div>
    </div>
  </div>
);
