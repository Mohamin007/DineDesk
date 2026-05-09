import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon, 
  BarChart4, 
  Users, 
  Zap, 
  ShieldCheck,
  RefreshCcw,
  ArrowUpRight,
  BrainCircuit,
  History,
  LayoutDashboard,
  Utensils,
  Package,
  Globe,
  DollarSign,
  Target,
  ChevronRight,
  Printer,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '@/services/aiService';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';

const REPORT_TYPES = [
  { id: 'executive', label: 'Executive Summary', icon: LayoutDashboard, desc: 'High-level business health & strategy' },
  { id: 'menu', label: 'Menu Performance', icon: Utensils, desc: 'Pricing, margins & item velocity' },
  { id: 'inventory', label: 'Inventory Intel', icon: Package, desc: 'Waste risk & stock optimization' },
  { id: 'market', label: 'Market Trends', icon: Globe, desc: 'Live Exa research & behavior shifts' },
  { id: 'revenue', label: 'Revenue/AOV', icon: DollarSign, desc: 'Combos, upsells & profitability' },
  { id: 'strategic', label: 'Strategic Action', icon: Target, desc: 'Short/long term growth directives' },
];

export const ExecutiveReport = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [reportsCache, setReportsCache] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const report = reportsCache[activeTab];

  const user = auth.currentUser;
  const userKey = user?.uid || 'demo';
  const HISTORY_KEY = `report_history_${userKey}`;

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, [userKey]);

  const saveToHistory = (newReport: any) => {
    const updated = [newReport, ...history].slice(0, 10); // Keep last 10
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const fetchReport = async (type = activeTab, force = false) => {
    if (!force && reportsCache[type]) return; // Use cache if available and not forced
    
    setLoading(true);
    try {
      const data = await aiService.getExecutiveReport(type);
      setReportsCache(prev => ({ ...prev, [type]: data }));
      saveToHistory(data);
    } catch (error) {
      console.error("Report Fetch Failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);

  const exportAsTxt = () => {
    if (!report) return;
    const content = `
DINEDESK - EXECUTIVE REPORT
--------------------------------
TYPE: ${report.title}
DATE: ${new Date(report.timestamp).toLocaleString()}
CONFIDENCE: ${report.confidenceScore}%

SUMMARY:
${report.summary}

SCORES:
- Health: ${report.scores.health}/100
- Velocity: ${report.scores.velocity}/100
- Integrity: ${report.scores.integrity}/100
- Potential: ${report.scores.potential}/100

ANALYSIS:
${report.sections.map((s: any) => `\n[${s.title}]\n${s.content}\nInsights: ${s.insights.join(', ')}`).join('\n')}

RECOMMENDATIONS:
${report.recommendations.map((r: any) => `- [${r.timeline}] ${r.task} (Impact: ${r.impact})`).join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DineDesk_Report_${activeTab}_${Date.now()}.txt`;
    a.click();
  };

  const exportAsPdf = () => {
    if (!report) return;
    
    // Lazy load jspdf
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('DINEDESK', margin, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text('EXECUTIVE INTELLIGENCE BRIEFING', margin, y + 6);
      y += 25;

      // Report Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(report.title.toUpperCase(), margin, y);
      y += 10;

      // Metadata
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150);
      const dateStr = new Date(report.timestamp).toLocaleString();
      doc.text(`DATE: ${dateStr}`, margin, y);
      doc.text(`CONFIDENCE: ${report.confidenceScore}%`, pageWidth - margin - 40, y);
      y += 15;

      // Line
      doc.setDrawColor(230);
      doc.line(margin, y, pageWidth - margin, y);
      y += 15;

      // Summary
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('EXECUTIVE NARRATIVE', margin, y);
      y += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      const summaryLines = doc.splitTextToSize(report.summary, pageWidth - (margin * 2));
      doc.text(summaryLines, margin, y);
      y += (summaryLines.length * 5) + 15;

      // Scores
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('VITALITY METRICS', margin, y);
      y += 12;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Operational Health: ${report.scores.health}/100`, margin, y);
      doc.text(`Growth Velocity: ${report.scores.velocity}/100`, margin + 50, y);
      doc.text(`Data Integrity: ${report.scores.integrity}/100`, margin + 100, y);
      doc.text(`Growth Potential: ${report.scores.potential}/100`, margin + 150, y);
      y += 20;

      // Sections
      report.sections.forEach((sec: any) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229); // Indigo-600
        doc.text(sec.title.toUpperCase(), margin, y);
        y += 7;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80);
        const contentLines = doc.splitTextToSize(sec.content, pageWidth - (margin * 2));
        doc.text(contentLines, margin, y);
        y += (contentLines.length * 5) + 5;

        // Insights as tags
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text(`Target Signals: ${sec.insights.join(' | ')}`, margin, y);
        y += 15;
      });

      // Recommendations
      if (y > 200) {
        doc.addPage();
        y = 30;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('TACTICAL DIRECTIVES', margin, y);
      y += 10;

      report.recommendations.forEach((rec: any, i: number) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        // Simple color mapping for impact
        if (rec.impact === 'High') {
          doc.setTextColor(225, 29, 72); // rose-500
        } else {
          doc.setTextColor(79, 70, 229); // indigo-600
        }
        doc.text(`${i + 1}. [${rec.impact} IMPACT] - ${rec.timeline}`, margin, y);
        y += 5;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60);
        doc.text(rec.task, margin + 5, y);
        y += 10;
      });

      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(200);
        doc.text(`DineDesk Intelligence Briefing - CONFIDENTIAL - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      doc.save(`DineDesk_Report_${activeTab}_${Date.now()}.pdf`);
    }).catch(err => {
      console.error('PDF Generation Failed:', err);
    });
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <BrainCircuit className="w-10 h-10 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter animate-pulse">
            Synthesizing {REPORT_TYPES.find(t => t.id === activeTab)?.label}
          </h3>
          <p className="text-zinc-500 text-sm font-mono max-w-sm mx-auto">
            Leveraging Llama-3.3 Reasoning & Live Market Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* 
        PREMIUM NAVIGATION RAIL
        Fixed position, stable interaction, obsidian-grade aesthetic.
      */}
      <aside className="w-80 h-screen sticky top-0 border-r border-black/[0.03] dark:border-white/[0.03] bg-white dark:bg-zinc-900/40 p-8 flex flex-col gap-12 print-hidden">
        <div className="space-y-1.5 pl-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase dark:text-white">Cortex Intel</h2>
          </div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em] pl-0.5">Automated Intelligence B.I.</p>
        </div>

        <nav className="space-y-1 flex-1">
          {REPORT_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = activeTab === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all group relative text-left outline-none",
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-2xl transition-all duration-500",
                  isActive 
                    ? "bg-indigo-500/10 scale-110" 
                    : "bg-transparent group-hover:bg-zinc-100 dark:group-hover:bg-white/5"
                )}>
                  <Icon className={cn("w-4 h-4", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                </div>
                
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-widest">{type.label}</p>
                </div>

                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* History Rail */}
        <div className="space-y-6">
          <div className="h-px bg-zinc-100 dark:bg-white/5 mx-2" />
          <div className="px-3 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <History className="w-3.5 h-3.5" />
              Strategic Logs
            </div>
            <div className="space-y-3">
              {history.length > 0 ? (
                history.slice(0, 4).map((h, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setReportsCache(prev => ({ ...prev, [h.type || activeTab]: h }));
                      if (h.type) setActiveTab(h.type);
                    }}
                    className="w-full text-left text-[10px] font-bold text-zinc-500 hover:text-indigo-500 transition-colors truncate block opacity-70 hover:opacity-100"
                  >
                    {h.title || "Untitled Intelligence"}
                  </button>
                ))
              ) : (
                <p className="text-[10px] italic text-zinc-400/50">Listening for data streams...</p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* 
        CINEMATIC REPORT VIEWPORT
        Expansive, clean, focused on elite presentation.
      */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-16 lg:px-16 lg:py-24 space-y-24">
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-32 flex flex-col items-center justify-center space-y-10 text-center"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-2xl flex items-center justify-center">
                    <RefreshCcw className="w-10 h-10 text-indigo-500 animate-spin-slow" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-center shadow-xl">
                    <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                    Synthesizing {REPORT_TYPES.find(t => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase animate-pulse">
                    Cross-referencing live market signals...
                  </p>
                </div>
              </motion.div>
            ) : report ? (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-24"
              >
                {/* Header Layer */}
                <header className="flex flex-col lg:flex-row justify-between items-start gap-12">
                  <div className="space-y-8 max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Executive Grade Verified Intel
                    </div>
                    
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] dark:text-white">
                      {report.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-widest pt-4">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 opacity-50" />
                        {new Date(report.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Confidence Index: {report.confidenceScore}%
                      </div>
                      <div className="flex items-center gap-2.5 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-lg text-zinc-500 dark:text-zinc-400">
                        <Lock className="w-3.5 h-3.5" />
                        Strategic Access Only
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 print-hidden pt-2">
                    <button 
                      onClick={() => fetchReport(activeTab, true)}
                      className="p-5 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all text-zinc-400 hover:text-indigo-500 group"
                    >
                      <RefreshCcw className="w-6 h-6 group-active:rotate-180 transition-transform duration-700" />
                    </button>
                    
                    <div className="relative group">
                      <button className="h-16 px-8 rounded-[1.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all outline-none">
                        <Download className="w-5 h-5 stroke-[2.5px]" />
                        Export Intel
                      </button>
                      <div className="absolute right-0 top-full mt-4 w-60 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-[2rem] shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <button onClick={exportAsPdf} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 text-left text-[11px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">
                          <Printer className="w-4 h-4 text-rose-500" />
                          PDF Briefing
                        </button>
                        <button onClick={exportAsTxt} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 text-left text-[11px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          Raw Intel Logs
                        </button>
                      </div>
                    </div>
                  </div>
                </header>

                {/* KPI Ribbon */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  <ExecutiveScore label="Core Vitality" score={report.scores.health} color="bg-emerald-500" icon={Zap} />
                  <ExecutiveScore label="Market Speed" score={report.scores.velocity} color="bg-indigo-500" icon={TrendingUp} />
                  <ExecutiveScore label="Synthesized Logic" score={report.scores.integrity} color="bg-blue-500" icon={ShieldCheck} />
                  <ExecutiveScore label="Upside Reserve" score={report.scores.potential} color="bg-orange-500" icon={Target} />
                </section>

                {/* Narrative Layer */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 lg:gap-24">
                  <div className="xl:col-span-8 space-y-24">
                    <section className="space-y-12">
                      <div className="flex items-center gap-6">
                        <span className="h-px flex-1 bg-black/[0.03] dark:bg-white/[0.03]" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Executive Narrative</h3>
                        <span className="h-px flex-1 bg-black/[0.03] dark:bg-white/[0.03]" />
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-12 top-0 text-9xl font-serif text-indigo-500/10 italic leading-none select-none">“</div>
                        <p className="text-2xl lg:text-4xl font-medium leading-[1.6] dark:text-zinc-200 tracking-tight">
                          {report.summary}
                        </p>
                      </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {report.sections.map((sec: any, i: number) => (
                        <div key={i} className="space-y-6 group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                              <BarChart4 className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] dark:text-white">{sec.title}</h4>
                          </div>
                          
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-[1.8] font-medium pl-2">
                            {sec.content}
                          </p>

                          <div className="flex flex-wrap gap-2 pl-2">
                            {sec.insights.map((insight: string, j: number) => (
                              <span key={j} className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/5 text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                                {insight}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </section>
                  </div>

                  {/* Strategic Sidebar */}
                  <aside className="xl:col-span-4 space-y-12">
                    <div className="p-10 rounded-[3rem] bg-zinc-900 dark:bg-zinc-800 text-white shadow-3xl space-y-12 sticky top-12 border border-white/5">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                          Directives
                        </h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Immediate Tactical Response</p>
                      </div>

                      <div className="space-y-10">
                        {report.recommendations.map((rec: any, i: number) => (
                          <div key={i} className="space-y-4 group cursor-default">
                            <div className="flex justify-between items-center">
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg",
                                rec.impact === 'High' ? "bg-rose-500 text-white" : "bg-indigo-500 text-white"
                              )}>
                                {rec.impact} Impact
                              </span>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{rec.timeline}</span>
                            </div>
                            <div className="flex gap-5 items-start">
                              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[11px] font-black group-hover:bg-indigo-500 transition-colors">
                                {i + 1}
                              </div>
                              <p className="text-sm font-bold leading-relaxed group-hover:text-indigo-300 transition-colors">{rec.task}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-6 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all hover:translate-y-[-2px] active:translate-y-0">
                        Authorize Execution
                      </button>
                    </div>

                    <div className="px-8 space-y-4">
                      <div className="flex items-center gap-3 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-4 h-4" />
                        Synthesized Logic
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed italic font-medium">
                        Strategic briefing finalized via Llama-3.3 Advanced Reasoning. Verified against sector-specific live data streams for absolute precision.
                      </p>
                    </div>
                  </aside>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-48 flex flex-col items-center justify-center space-y-8 text-center"
              >
                <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                   <BrainCircuit className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Null Intelligence</h3>
                  <p className="text-zinc-500 text-sm font-medium">Initialize sector scan to compile strategic data.</p>
                </div>
                <button 
                  onClick={() => fetchReport(activeTab, true)}
                  className="px-12 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Generate Scan
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const ExecutiveScore = ({ label, score, color, icon: Icon }: any) => (
  <div className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 relative group overflow-hidden hover:scale-[1.02] transition-all">
    <div className={cn("absolute -top-2 -right-2 p-4 opacity-5 group-hover:scale-125 transition-transform", color.replace('bg-', 'text-'))}>
      <Icon className="w-16 h-16" />
    </div>
    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black dark:text-white tracking-tighter">{score}</span>
      <span className="text-[10px] font-bold text-zinc-500 uppercase">/ 100</span>
    </div>
    <div className="mt-3 w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={cn("h-full", color)} 
      />
    </div>
  </div>
);
