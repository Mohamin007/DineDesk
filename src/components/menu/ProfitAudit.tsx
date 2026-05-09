import { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  BarChart3, 
  Globe, 
  Sparkles,
  ArrowLeft,
  X,
  Target,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '@/lib/utils';
import { dataService } from '@/services/dataService';
import { aiService } from '@/services/aiService';

interface AuditItem {
  name: string;
  currentPrice: number;
  calculatedCost: number;
  currentMargin: number;
  marketAvgPrice: number;
  marketPremiumPrice: number;
  priceStatus: 'underpriced' | 'overpriced' | 'optimal';
  profitabilityScore: number;
  trendStrength: number;
  findings: string[];
  directives: string[];
}

interface AuditData {
  overallScore: number;
  marketSentiment: string;
  items: AuditItem[];
  globalStrategy: string;
}

export const ProfitAudit = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<'select' | 'analyzing' | 'report'>('select');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const allDishes = dataService.getMenu();

  const toggleItem = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const runAudit = async () => {
    if (selectedIds.length === 0) return;
    
    setStep('analyzing');
    const items = allDishes.filter(d => selectedIds.includes(d.id));
    
    try {
      const response = await aiService.ask(
        `Perform a high-precision visual profit audit for these items.`,
        'profit-audit',
        { selectedItems: items }
      );
      
      const parsed = JSON.parse(response);
      setAuditData(parsed);
      setStep('report');
    } catch (error) {
      console.error('Audit failed', error);
      setStep('select');
    }
  };

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
              AI Profit Audit
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none mt-1">
              Market Intelligence System v4.5
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3">
                {[ 
                    { s: 'select', l: 'Selection' },
                    { s: 'analyzing', l: 'Neural Analysis' },
                    { s: 'report', l: 'Visual Intelligence' }
                ].map((s, i) => (
                    <div key={s.s} className="flex items-center gap-3">
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all",
                            step === s.s ? "bg-indigo-500 text-white" : "text-zinc-400"
                        )}>
                            {s.l}
                        </div>
                        {i < 2 && <ChevronRight className="w-3 h-3 text-zinc-300" />}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div 
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Select Items for Intelligence Audit</h3>
                <p className="text-zinc-500 text-sm italic">Audit multiple items to discover cross-category profitability gaps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-32">
                {allDishes.map((dish) => (
                  <button
                    key={dish.id}
                    onClick={() => toggleItem(dish.id)}
                    className={cn(
                      "group p-6 rounded-[2rem] border transition-all text-left relative overflow-hidden",
                      selectedIds.includes(dish.id) 
                        ? "bg-indigo-500 text-white border-indigo-600 shadow-xl shadow-indigo-500/20" 
                        : "bg-black/5 dark:bg-white/5 border-transparent hover:border-black/10 dark:hover:border-white/10"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            selectedIds.includes(dish.id) ? "bg-white/20" : "bg-black/5 dark:bg-white/5"
                        )}>
                             <Target className="w-5 h-5" />
                        </div>
                        <CheckCircle2 className={cn(
                            "w-5 h-5 transition-all transform",
                            selectedIds.includes(dish.id) ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        )} />
                    </div>
                    <p className="text-sm font-black mb-1 leading-tight">{dish.name}</p>
                    <div className="flex items-center justify-between mt-4">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                            selectedIds.includes(dish.id) ? "bg-white/20" : "bg-black/10 dark:bg-white/10 text-zinc-500"
                        )}>
                            {dish.category}
                        </span>
                        <span className="text-sm font-mono">{formatCurrency(dish.price)}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
                <button 
                  onClick={runAudit}
                  disabled={selectedIds.length === 0}
                  className="w-full py-4 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Initiate AI Audit
                </button>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div 
               key="analyzing"
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
                    <Zap className="w-12 h-12 text-indigo-500 animate-bounce" />
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Processing Intelligence...</h3>
                <div className="space-y-3">
                    {[
                        { icon: Globe, label: 'Accessing Live Exa Pricing Index' },
                        { icon: BarChart3, label: 'Calculating Market Benchmark Sigma' },
                        { icon: Sparkles, label: 'Constructing Visual Health Dashboard' }
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
          )}

          {step === 'report' && auditData && (
            <motion.div 
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-6xl mx-auto space-y-8 pb-20"
            >
              {/* Executive Summary Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-10 rounded-[3rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Zap className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Global Strategy</p>
                                <h3 className="text-2xl font-black tracking-tight">Executive Summary</h3>
                            </div>
                        </div>
                        <p className="text-xl font-medium leading-relaxed opacity-90 italic">
                            "{auditData.globalStrategy}"
                        </p>
                    </div>
                </div>

                <div className="p-10 rounded-[3rem] bg-zinc-900 text-white shadow-xl flex flex-col justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Neural Health Score</p>
                        <h4 className="text-6xl font-black tracking-tighter">{auditData.overallScore}</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-400">Market Sentiment</span>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase">
                                {auditData.marketSentiment}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${auditData.overallScore}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    </div>
                </div>
              </div>

              {/* Individual Item Intelligence */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white px-4">Menu Item Visual Intelligence</h3>
                <div className="grid grid-cols-1 gap-6">
                  {auditData.items.map((item, idx) => (
                    <motion.div 
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                            {/* Comparison Column */}
                            <div className="xl:col-span-5 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                item.priceStatus === 'underpriced' ? "bg-emerald-500/10 text-emerald-500" :
                                                item.priceStatus === 'overpriced' ? "bg-rose-500/10 text-rose-500" :
                                                "bg-indigo-500/10 text-indigo-500"
                                            )}>
                                                {item.priceStatus}
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Pricing Efficiency</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your Price</p>
                                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{formatCurrency(item.currentPrice)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Market Price Benchmark</p>
                                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                                            <TrendingUp className="w-3 h-3" />
                                            Target: {formatCurrency(item.marketPremiumPrice)}
                                        </div>
                                    </div>
                                    <div className="relative h-12 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center px-4 overflow-hidden">
                                        {/* Market Avg Marker */}
                                        <div 
                                            className="absolute top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700 z-10"
                                            style={{ left: '50%' }}
                                        />
                                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase opacity-40 z-20">Market Avg</div>
                                        
                                        {/* Your Position Marker */}
                                        <motion.div 
                                            initial={{ left: '0%' }}
                                            animate={{ left: `${(item.currentPrice / item.marketPremiumPrice) * 100}%` }}
                                            transition={{ delay: 0.8, type: 'spring' }}
                                            className="absolute w-2 h-8 bg-indigo-500 rounded-full z-30 shadow-lg shadow-indigo-500/50"
                                        />
                                        
                                        <div className="w-full flex justify-between text-[10px] font-mono text-zinc-500 relative z-0">
                                            <span>{formatCurrency(item.marketAvgPrice * 0.8)}</span>
                                            <span>{formatCurrency(item.marketPremiumPrice * 1.2)}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 italic">Positioned at {(item.currentPrice / item.marketAvgPrice * 100).toFixed(0)}% of market average.</p>
                                </div>
                            </div>

                            {/* Metrics Column */}
                            <div className="xl:col-span-3 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 flex flex-col justify-between">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Margin Quality</p>
                                    <div>
                                        <p className="text-xl font-black text-zinc-900 dark:text-white">{item.currentMargin}%</p>
                                        <div className="w-full bg-black/10 dark:bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-indigo-500 h-full" style={{ width: `${item.profitabilityScore}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 flex flex-col justify-between">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Demand Trend</p>
                                    <div>
                                        <p className="text-xl font-black text-zinc-900 dark:text-white">{item.trendStrength}%</p>
                                        <div className="w-full bg-black/10 dark:bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-emerald-500 h-full" style={{ width: `${item.trendStrength}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-4">Strategic Directives</p>
                                    <ul className="space-y-3">
                                        {item.directives.map((d, i) => (
                                            <li key={i} className="flex items-start gap-3 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                                <div className="w-5 h-5 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-indigo-500/20">
                                                    <ArrowUpRight className="w-3 h-3 text-white" />
                                                </div>
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Analytics Column */}
                            <div className="xl:col-span-4 bg-zinc-50 dark:bg-white/5 rounded-[2rem] p-6 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4 text-zinc-400" />
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Regional Intelligence</p>
                                </div>
                                <div className="space-y-3">
                                    {item.findings.map((f, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 flex-shrink-0" />
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                                {f}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 text-white rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight">Apply Neural Adjustments</h4>
                    <p className="text-zinc-400 text-sm max-w-lg">Would you like to automatically sync these pricing benchmarks to your Menu Management system?</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 rounded-2xl bg-white text-zinc-900 font-black hover:scale-105 transition-all">
                        Sync Optimized Pricing
                    </button>
                    <button 
                        onClick={() => setStep('select')}
                        className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black hover:bg-white/20 transition-all"
                    >
                        New Audit
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
