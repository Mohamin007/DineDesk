/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Globe,
  Instagram,
  Facebook,
  Smartphone,
  Users,
  Target,
  Rocket,
  ShieldCheck,
  ZapOff,
  Video,
  Monitor,
  Heart,
  BarChart4,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { aiService } from '@/services/aiService';

interface AuditData {
  name: string;
  cuisine: string;
  location: string;
  targetAudience: string;
  businessType: string;
  businessSize: string;
  bestSellers: string;
  pricing: string;
  innovationFreq: string;
  hasWebsite: boolean;
  hasOrdering: boolean;
  hasGMB: boolean;
  platforms: string[];
  postFreq: string;
  contentStyle: string;
  usesVideo: boolean;
  hasInfluencers: boolean;
  engagementQuality: string;
  repeatRate: string;
  challenges: string;
  goals: string;
}

const INITIAL_DATA: AuditData = {
  name: '',
  cuisine: '',
  location: '',
  targetAudience: '',
  businessType: 'Dine-in',
  businessSize: 'Small (1-10 staff)',
  bestSellers: '',
  pricing: 'Mid-range',
  innovationFreq: 'Monthly',
  hasWebsite: false,
  hasOrdering: false,
  hasGMB: false,
  platforms: [],
  postFreq: 'Rarely',
  contentStyle: 'Traditional',
  usesVideo: false,
  hasInfluencers: false,
  engagementQuality: 'Low (Silent)',
  repeatRate: '30-50%',
  challenges: '',
  goals: ''
};

export const AnalyzeRestaurant = ({ onFinishAnalysis }: { onFinishAnalysis: () => void }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AuditData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const updateData = (fields: Partial<AuditData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const runAnalysis = async () => {
    setLoading(true);
    setStep(7); // Loading step
    try {
      const result = await aiService.runStandaloneAudit(data);
      setReport(result);
      setStep(8); // Report step
    } catch (e) {
      console.error(e);
      setStep(6);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex flex-col relative overflow-hidden">
      {/* Neural Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10" />

      {/* Modern Top Nav */}
      <nav className="p-8 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase whitespace-nowrap">
            DineDesk <span className="text-orange-500 italic">Audit</span>
          </span>
        </div>
        
        {step > 0 && step < 7 && (
          <div className="hidden md:flex items-center gap-2">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i < step ? "bg-orange-500 w-8" : i === step ? "bg-zinc-300 dark:bg-white/20 w-12" : "bg-zinc-100 dark:bg-white/5 w-4"
                )} 
              />
            ))}
          </div>
        )}

        <button 
          onClick={onFinishAnalysis}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Exit Audit
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-7xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-12 max-w-4xl"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/5 border border-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Next-Gen Business Intelligence
                </div>
                <h1 className="text-7xl lg:text-9xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.85]">
                  Audit Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-500 italic">Survival Potential.</span>
                </h1>
                <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
                  Our neural engine analyzes your market alignment, digital footprint, and Gen Z compatibility to determine if your business is prepared for 2026.
                </p>
              </div>
              <button 
                onClick={handleNext}
                className="group px-12 py-8 rounded-[3rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xl font-black shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto"
              >
                Launch Intelligence Scan <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <FormStep 
              key="step1"
              title="Business DNA"
              description="Establishing your core operational markers."
              onNext={handleNext}
              onBack={handleBack}
              canNext={!!data.name && !!data.cuisine && !!data.location}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Business Name" value={data.name} onChange={v => updateData({ name: v })} placeholder="e.g. Neon Sushi Bar" />
                <InputGroup label="Cuisine/Type" value={data.cuisine} onChange={v => updateData({ cuisine: v })} placeholder="e.g. Modern Japanese" />
                <InputGroup label="Location (City)" value={data.location} onChange={v => updateData({ location: v })} placeholder="e.g. Austin, TX" icon={MapPin} />
                <SelectGroup 
                  label="Target Audience" 
                  value={data.targetAudience} 
                  onChange={v => updateData({ targetAudience: v })}
                  options={['Gen Z / Alpha', 'Millennials', 'Families', 'Corporate/Office', 'Elite/Fine Dining']}
                />
              </div>
            </FormStep>
          )}

          {step === 2 && (
            <FormStep 
              key="step2"
              title="Operational Core"
              description="Defining the scale and mode of your enterprise."
              onNext={handleNext}
              onBack={handleBack}
              canNext={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <OptionGrid 
                  label="Business Mode"
                  value={data.businessType}
                  onChange={v => updateData({ businessType: v })}
                  options={['Dine-in', 'Cloud Kitchen', 'Quick Service', 'Hybrid (Dine + Delivery)']}
                />
                <OptionGrid 
                  label="Team Size"
                  value={data.businessSize}
                  onChange={v => updateData({ businessSize: v })}
                  options={['Solo/Micro', 'Small (1-10 staff)', 'Medium (11-50)', 'Enterprise (50+)']}
                />
              </div>
            </FormStep>
          )}

          {step === 3 && (
            <FormStep 
              key="step3"
              title="Menu & Pricing"
              description="Analyzing your product-market fit and innovation velocity."
              onNext={handleNext}
              onBack={handleBack}
              canNext={!!data.bestSellers}
            >
              <div className="space-y-8 w-full">
                <InputGroup label="Signature Best Sellers" value={data.bestSellers} onChange={v => updateData({ bestSellers: v })} placeholder="e.g. Truffle Mochi, Spicy Tuna Sando" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <OptionGrid 
                    label="Pricing Stratum"
                    value={data.pricing}
                    onChange={v => updateData({ pricing: v })}
                    options={['Value/Budget', 'Mid-range', 'Premium', 'Ultra-Luxury']}
                  />
                  <OptionGrid 
                    label="Innovation Frequency"
                    value={data.innovationFreq}
                    onChange={v => updateData({ innovationFreq: v })}
                    options={['Weekly', 'Monthly', 'Seasonally', 'Rarely']}
                  />
                </div>
              </div>
            </FormStep>
          )}

          {step === 4 && (
            <FormStep 
              key="step4"
              title="Digital Presence"
              description="Evaluating your readiness for a digital-first market."
              onNext={handleNext}
              onBack={handleBack}
              canNext={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <ToggleCard 
                  label="Modern Website" 
                  description="Optimized for speed and SEO."
                  active={data.hasWebsite} 
                  onToggle={() => updateData({ hasWebsite: !data.hasWebsite })} 
                  icon={Globe}
                />
                <ToggleCard 
                  label="Online Ordering" 
                  description="Direct digital revenue channel."
                  active={data.hasOrdering} 
                  onToggle={() => updateData({ hasOrdering: !data.hasOrdering })} 
                  icon={Smartphone}
                />
                <ToggleCard 
                  label="Google Business" 
                  description="Active GMB listing with reviews."
                  active={data.hasGMB} 
                  onToggle={() => updateData({ hasGMB: !data.hasGMB })} 
                  icon={MapPin}
                />
              </div>
            </FormStep>
          )}

          {step === 5 && (
            <FormStep 
              key="step5"
              title="Social Mastery"
              description="Analyzing platform relevance and content strategy."
              onNext={handleNext}
              onBack={handleBack}
              canNext={true}
            >
              <div className="space-y-8 w-full">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Active Platforms</label>
                  <div className="flex flex-wrap gap-4">
                    {['Instagram', 'TikTok', 'Facebook', 'X/Twitter', 'YouTube'].map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          const platforms = data.platforms.includes(p) 
                            ? data.platforms.filter(x => x !== p)
                            : [...data.platforms, p];
                          updateData({ platforms });
                        }}
                        className={cn(
                          "px-6 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2",
                          data.platforms.includes(p)
                            ? "bg-orange-500/10 border-orange-500 text-orange-500"
                            : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-500"
                        )}
                      >
                        {p === 'Instagram' && <Instagram className="w-4 h-4" />}
                        {p === 'TikTok' && <Video className="w-4 h-4" />}
                        {p === 'Facebook' && <Facebook className="w-4 h-4" />}
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <OptionGrid 
                    label="Posting Frequency"
                    value={data.postFreq}
                    onChange={v => updateData({ postFreq: v })}
                    options={['Multiple Daily', 'Daily', 'Few Times Weekly', 'Rarely']}
                  />
                  <OptionGrid 
                    label="Primary Content Style"
                    value={data.contentStyle}
                    onChange={v => updateData({ contentStyle: v })}
                    options={['Cinematic/High-end', 'Authentic/UGC', 'Traditional', 'Minimalist']}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ToggleCard 
                    label="Short-form Video Focus" 
                    description="Leveraging Reels/TikTok for organic viral growth."
                    active={data.usesVideo} 
                    onToggle={() => updateData({ usesVideo: !data.usesVideo })} 
                    icon={Video}
                  />
                  <ToggleCard 
                    label="Influencer Strategy" 
                    description="Active collaborations with local creators."
                    active={data.hasInfluencers} 
                    onToggle={() => updateData({ hasInfluencers: !data.hasInfluencers })} 
                    icon={Users}
                  />
                </div>
              </div>
            </FormStep>
          )}

          {step === 6 && (
            <FormStep 
              key="step6"
              title="Strategic Trajectory"
              description="Finalizing your growth goals and core friction points."
              onNext={runAnalysis}
              onBack={handleBack}
              canNext={!!data.challenges && !!data.goals}
              nextLabel="Initiate Neural Scan"
            >
              <div className="space-y-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <OptionGrid 
                    label="Engagement Quality"
                    value={data.engagementQuality}
                    onChange={v => updateData({ engagementQuality: v })}
                    options={['Very High (Viral)', 'Healthy (Active)', 'Low (Silent)', 'None']}
                  />
                  <OptionGrid 
                    label="Repeat Customer Rate"
                    value={data.repeatRate}
                    onChange={v => updateData({ repeatRate: v })}
                    options={['<10%', '10-30%', '30-50%', '50%+']}
                  />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Primary Business Challenges</label>
                   <textarea 
                    value={data.challenges}
                    onChange={e => updateData({ challenges: e.target.value })}
                    placeholder="What keeps you up at night? e.g. Customer acquisition in a crowded market, rising ingredient costs..."
                    className="w-full h-32 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 caret-orange-500 focus:border-orange-500/50 outline-none transition-all resize-none"
                   />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">12-Month Growth Goals</label>
                   <textarea 
                    value={data.goals}
                    onChange={e => updateData({ goals: e.target.value })}
                    placeholder="What does success look like? e.g. Opening a second location, becoming a local Instagram destination..."
                    className="w-full h-32 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 caret-orange-500 focus:border-orange-500/50 outline-none transition-all resize-none"
                   />
                </div>
              </div>
            </FormStep>
          )}

          {step === 7 && (
             <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center space-y-12"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 border-2 border-orange-500/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-4 border-2 border-orange-500/40 rounded-full"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.4, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <BrainCircuit className="w-20 h-20 text-orange-500 animate-pulse" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Synchronizing Strategic Data</h3>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      className="w-2 h-2 bg-orange-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 8 && report && (
            <motion.div 
              key="report"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-24 py-12"
            >
              {report?.error && (
                <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 px-6 py-4 text-sm text-amber-700 dark:text-amber-300">
                  {report.error}
                </div>
              )}

              {/* Report Header */}
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-12 border-b border-black/[0.03] dark:border-white/[0.03] pb-12">
                <div className="space-y-6 text-center md:text-left">
                  <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4" />
                    Strategic Audit Verified
                  </div>
                  <h2 className="text-6xl lg:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-[0.85]">
                     Future Intelligence <br />
                     <span className="text-zinc-300 dark:text-zinc-800 italic">Report</span>
                  </h2>
                </div>
                
                <div className="relative shrink-0 w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="96" cy="96" r="88"
                      className="fill-none stroke-zinc-100 dark:stroke-white/5 stroke-[12]"
                    />
                    <motion.circle
                      cx="96" cy="96" r="88"
                      className="fill-none stroke-orange-500 stroke-[12]"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 553" }}
                      animate={{ strokeDasharray: `${(report.overallScore / 100) * 553} 553` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter">{report.overallScore}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Score</span>
                  </div>
                </div>
              </div>

              {/* Scored Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ScoreMetric label="Digital Readiness" value={report.scores.digital} icon={Globe} />
                <ScoreMetric label="Market Alignment" value={report.scores.alignment} icon={Target} />
                <ScoreMetric label="Gen Z Appeal" value={report.scores.genZ} icon={Users} />
                <ScoreMetric label="Growth Vector" value={report.scores.growth} icon={ArrowUpRight} />
              </div>

              {/* Central Verdict */}
              <section className="p-16 lg:p-24 rounded-[4rem] bg-orange-500 text-white shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-110 transition-transform duration-1000">
                  <BrainCircuit className="w-96 h-96" />
                </div>
                <div className="relative space-y-12 max-w-5xl">
                   <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-[10px] font-black uppercase tracking-widest">
                     <Monitor className="w-4 h-4" />
                     Executive Summary
                   </div>
                   <h3 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight italic">
                     "{report.verdict}"
                   </h3>
                </div>
              </section>

              {/* Analysis Bento */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Market Position */}
                <div className="lg:col-span-2 p-12 rounded-[3.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-xl space-y-10">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                       <BarChart4 className="w-6 h-6" />
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tighter">Market Positioning</h4>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {report.positioning.analysis}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Core Strengths</p>
                      <ul className="space-y-3">
                        {report.positioning.strengths.map((s: string, i: number) => (
                          <li key={i} className="flex gap-2 text-xs font-bold text-zinc-900 dark:text-white">
                            <Plus className="w-4 h-4 text-emerald-500" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Vulnerabilities</p>
                      <ul className="space-y-3">
                        {report.positioning.weaknesses.map((w: string, i: number) => (
                           <li key={i} className="flex gap-2 text-xs font-bold text-zinc-500">
                             <ZapOff className="w-4 h-4 text-rose-500" /> {w}
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Digital Audit */}
                <div className="p-12 rounded-[3.5rem] bg-zinc-900 text-white shadow-2xl space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-white/5">
                    <Globe className="w-32 h-32" />
                  </div>
                  <div className="relative space-y-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      report.digitalAudit.status === 'Ready' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : 
                      report.digitalAudit.status === 'Evolving' ? "bg-orange-500/20 text-orange-400 border border-orange-500/20" : "bg-rose-500/20 text-rose-400 border border-rose-500/20"
                    )}>
                      Digital Status: {report.digitalAudit.status}
                    </span>
                    <h4 className="text-2xl font-black uppercase tracking-tighter">Social & Web Audit</h4>
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                      {report.digitalAudit.analysis}
                    </p>
                    <div className="space-y-4 pt-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Digital Directives</p>
                      <div className="space-y-2">
                        {report.digitalAudit.recommendations.map((r: string, i: number) => (
                          <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-300">
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

               {/* Future Readiness Section */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnalysisCard 
                  title="Gen Z Compatibility" 
                  score={report.genZAnalysis.score}
                  analysis={report.genZAnalysis.analysis}
                  footer={`${report.genZAnalysis.compatibilityLevel} Compatibility Level`}
                  icon={Heart}
                  color="text-rose-500"
                />
                <AnalysisCard 
                  title="2026 Future Readiness" 
                  score={report.futureReadiness.score}
                  analysis={report.futureReadiness.analysis}
                  footer={`${report.futureReadiness.modernizationSteps.length} Directives Identified`}
                  icon={ShieldCheck}
                  color="text-indigo-500"
                />
              </div>

              {/* Final Strategy Steps */}
              <div className="space-y-12">
                <div className="flex items-center gap-8">
                  <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-widest uppercase truncate shrink-0">Strategic Convergence Path</h3>
                  <div className="h-px w-full bg-black/5 dark:bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {report.strategy.map((s: any, i: number) => (
                    <div key={i} className="p-10 rounded-[3rem] bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm group hover:-translate-y-2 transition-all">
                       <div className="flex justify-between items-center mb-8">
                         <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{s.impact} Impact</span>
                         <ArrowUpRight className="w-6 h-6 text-zinc-300 dark:text-zinc-700 group-hover:text-orange-500 transition-colors" />
                       </div>
                       <h5 className="text-xl font-black uppercase tracking-tight mb-4">{s.title}</h5>
                       <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA */}
              <div className="text-center py-20 bg-zinc-900 dark:bg-white rounded-[4rem] text-white dark:text-zinc-900 space-y-10 shadow-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-indigo-500/10 opacity-50" />
                <div className="relative z-10 space-y-8 max-w-2xl mx-auto px-8">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                      Deploy the Full <br />
                      DineDesk Intelligence.
                    </h2>
                    <p className="text-zinc-400 dark:text-zinc-600 font-medium leading-relaxed">
                      Turn these insights into automated operations. Connect your POS, inventory, and social channels to the neural core.
                    </p>
                    <button 
                      onClick={onFinishAnalysis}
                      className="px-12 py-6 rounded-full bg-orange-500 text-white font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(249,115,22,0.4)]"
                    >
                      Connect Your Business
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const FormStep = ({ children, title, description, onNext, onBack, canNext, nextLabel = 'Continue Analysis' }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="w-full max-w-4xl space-y-12"
  >
    <div className="space-y-4">
      <h2 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-tight">{title}</h2>
      <p className="text-lg text-zinc-500 font-medium">{description}</p>
    </div>

    <div className="space-y-12">
      {children}
    </div>

    <div className="flex gap-6">
      <button 
        onClick={onBack}
        className="p-6 rounded-[2rem] bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button 
        onClick={onNext}
        disabled={!canNext}
        className="flex-1 py-6 rounded-[2.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
      >
        {nextLabel} <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  </motion.div>
);

const InputGroup = ({ label, value, onChange, placeholder, icon: Icon }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />}
      <input 
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl py-6 px-8 text-zinc-900 dark:text-white focus:border-orange-500/50 outline-none transition-all font-medium",
          Icon && "pl-16"
        )}
      />
    </div>
  </div>
);

const SelectGroup = ({ label, value, onChange, options }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</label>
    <select 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl py-6 px-8 text-zinc-900 dark:text-white focus:border-orange-500/50 outline-none transition-all font-medium appearance-none"
    >
      <option value="">Select Option</option>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const OptionGrid = ({ label, value, onChange, options }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">{label}</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((o: string) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "p-5 rounded-2xl border text-xs font-bold transition-all text-left",
            value === o 
              ? "bg-orange-500/10 border-orange-500 text-orange-500"
              : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-500 hover:border-zinc-300 dark:hover:border-white/20"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const ToggleCard = ({ label, description, active, onToggle, icon: Icon }: any) => (
  <button 
    onClick={onToggle}
    className={cn(
      "p-8 rounded-[3rem] border transition-all text-left relative group",
      active 
        ? "bg-orange-500/5 border-orange-500 shadow-lg shadow-orange-500/10"
        : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5"
    )}
  >
    <div className={cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
      active ? "bg-orange-500 text-white" : "bg-black/5 dark:bg-white/5 text-zinc-400"
    )}>
      <Icon className="w-6 h-6" />
    </div>
    <h5 className={cn("text-lg font-black uppercase tracking-tight mb-2", active ? "text-orange-500" : "text-zinc-900 dark:text-white")}>{label}</h5>
    <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
    {active && <CheckCircle2 className="absolute top-8 right-8 w-6 h-6 text-orange-500" />}
  </button>
);

const ScoreMetric = ({ label, value, icon: Icon }: any) => (
  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm space-y-8">
    <div className="flex justify-between items-center">
      <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-2xl text-orange-500">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">{value}%</span>
    </div>
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
      <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-orange-500"
        />
      </div>
    </div>
  </div>
);

const AnalysisCard = ({ title, score, analysis, footer, icon: Icon, color }: any) => (
  <div className="p-12 rounded-[3.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-xl space-y-10 group">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className={cn("p-4 rounded-2xl bg-black/5 dark:bg-white/5 transition-colors group-hover:bg-zinc-100 dark:group-hover:bg-white/10", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-black uppercase tracking-tighter">{title}</h4>
      </div>
      <div className="text-3xl font-black tracking-tighter">{score}%</div>
    </div>
    <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
      {analysis}
    </p>
    <div className="pt-6 border-t border-black/[0.03] dark:border-white/[0.03] flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
       {footer}
       <div className="w-24 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
         <div className={cn("h-full", color.replace('text-', 'bg-'))} style={{ width: `${score}%` }} />
       </div>
    </div>
  </div>
);
