/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Plus, 
  Upload, 
  Store, 
  Settings, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { auth } from '../../lib/firebase';

const StepWrapper = ({ title, description, children, onNext, showNext = true, isNextDisabled = false }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-12"
  >
    <div className="space-y-4">
      <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{title}</h2>
      <p className="text-zinc-500 max-w-lg">{description}</p>
    </div>
    {children}
    {showNext && (
      <button 
        onClick={onNext}
        disabled={isNextDisabled}
        className="px-12 py-5 rounded-full bg-orange-500 text-white font-black text-xl shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
      >
        Continue <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    )}
  </motion.div>
);

export const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState({
    // Owner Info
    ownerName: '',
    ownerRole: 'Owner/Founder',
    
    // Business Info
    restaurantName: '',
    businessType: 'Casual Dining',
    cuisine: 'Modern Fusion',
    locationsCount: '1',
    city: 'New York',
    country: 'USA',
    seatingCapacity: '40-60',

    // Operations
    avgDailyOrders: '100-200',
    monthlyRevenue: '$50k - $100k',
    teamSize: '12',
    deliveryPlatforms: ['UberEats', 'DoorDash'],
    peakHours: '7 PM - 10 PM',

    // Menu & Pain Points
    menuCategories: 'Appetizers, Mains, Cocktails',
    signatureItems: 'Truffle Burger, Spiced Old Fashioned',
    pricingStyle: 'Premium / Value-driven',
    inventoryChallenges: 'High wastage in fresh produce',
    operationalPainPoints: 'Labor scheduling and staff turnover',

    // AI Goals
    businessGoals: 'Scale to 3 locations in 18 months',
    growthTarget: '15% MoM revenue growth',
    preferredAnalytics: 'Profit Margin Optimization'
  });

  const nextStep = () => {
    if (step === totalSteps) {
      const userKey = auth.currentUser?.email || JSON.parse(sessionStorage.getItem('demo_user') || '{}').email || '';
      if (userKey) {
        sessionStorage.setItem(`onboarding_data_${userKey}`, JSON.stringify(formData));
      } else {
        sessionStorage.setItem('onboarding_data', JSON.stringify(formData));
      }
      onFinish();
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleDelivery = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryPlatforms: prev.deliveryPlatforms.includes(platform)
        ? prev.deliveryPlatforms.filter(p => p !== platform)
        : [...prev.deliveryPlatforms, platform]
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex flex-col selection:bg-orange-500/30 selection:text-orange-500">
      {/* Header */}
      <header className="px-12 py-8 flex justify-between items-center border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">DineDesk <span className="text-orange-500">Core</span></span>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex gap-2">
             {Array.from({ length: totalSteps }).map((_, i) => (
               <div 
                 key={i} 
                 className={cn(
                   "h-1 rounded-full transition-all duration-700", 
                   i + 1 <= step ? "bg-orange-500 w-8" : "bg-black/5 dark:bg-white/10 w-4"
                 )} 
               />
             ))}
           </div>
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden md:block">Neural Initialization: {Math.round((step/totalSteps)*100)}%</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center py-20 px-8">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepWrapper 
                key="step1"
                title="Executive Identity"
                description="We need to know who is behind the helm. Your AI copilot will address you personally."
                onNext={nextStep}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Marcus Aurelius"
                        value={formData.ownerName}
                        onChange={(e) => updateForm('ownerName', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Your Role</label>
                      <select 
                        value={formData.ownerRole}
                        onChange={(e) => updateForm('ownerRole', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium appearance-none"
                      >
                        <option>Owner/Founder</option>
                        <option>Executive Chef</option>
                        <option>General Manager</option>
                        <option>Operations Director</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold dark:text-white text-zinc-900 mb-2">Personalized Intelligence</h4>
                    <p className="text-sm text-zinc-500">Your AI Copilot uses this to calibrate its advice based on your specific responsibilities.</p>
                  </div>
                </div>
              </StepWrapper>
            )}

            {step === 2 && (
              <StepWrapper 
                key="step2"
                title="Business Core"
                description="The DNA of your restaurant. This informs all market analysis and trend forecasting."
                onNext={nextStep}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2 text-zinc-900 dark:text-white">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Restaurant Name</label>
                      <input 
                        type="text" 
                        placeholder="The Iron Kitchen"
                        value={formData.restaurantName}
                        onChange={(e) => updateForm('restaurantName', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Cuisine Type</label>
                        <input 
                          type="text" 
                          placeholder="Italian Fusion"
                          value={formData.cuisine}
                          onChange={(e) => updateForm('cuisine', e.target.value)}
                          className="w-full px-4 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">City</label>
                        <input 
                          type="text" 
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          className="w-full px-4 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Number of Locations</label>
                       <div className="flex gap-2">
                         {['1', '2-5', '6-10', '10+'].map(num => (
                           <button 
                             key={num}
                             onClick={() => updateForm('locationsCount', num)}
                             className={cn(
                               "flex-1 py-3 rounded-xl border transition-all text-xs font-bold",
                               formData.locationsCount === num 
                                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" 
                                : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-500 hover:border-orange-500/30"
                             )}
                           >
                             {num}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Total Seating Capacity</label>
                       <div className="flex gap-2">
                         {['<20', '20-50', '50-100', '100+'].map(cap => (
                           <button 
                             key={cap}
                             onClick={() => updateForm('seatingCapacity', cap)}
                             className={cn(
                               "flex-1 py-3 rounded-xl border transition-all text-xs font-bold",
                               formData.seatingCapacity === cap 
                                ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-500 hover:border-indigo-500/30"
                             )}
                           >
                             {cap}
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {step === 3 && (
              <StepWrapper 
                key="step3"
                title="Operational Velocity"
                description="Help us understand the scale of your current operations to calibrate performance benchmarks."
                onNext={nextStep}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Avg Daily Orders</label>
                       <select 
                        value={formData.avgDailyOrders}
                        onChange={(e) => updateForm('avgDailyOrders', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium appearance-none"
                      >
                        <option>Under 50</option>
                        <option>50-150</option>
                        <option>150-300</option>
                        <option>300+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Monthly Revenue Target</label>
                       <select 
                        value={formData.monthlyRevenue}
                        onChange={(e) => updateForm('monthlyRevenue', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium appearance-none"
                      >
                        <option>$0 - $50k</option>
                        <option>$50k - $150k</option>
                        <option>$150k - $500k</option>
                        <option>$500k+</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Active Delivery Channels</label>
                       <div className="grid grid-cols-2 gap-3">
                         {['UberEats', 'DoorDash', 'Grubhub', 'Direct Delivery'].map(p => (
                           <button 
                             key={p}
                             onClick={() => toggleDelivery(p)}
                             className={cn(
                               "py-3 rounded-xl border transition-all text-xs font-black uppercase tracking-tighter",
                               formData.deliveryPlatforms.includes(p) 
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                                : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-500"
                             )}
                           >
                             {p}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Peak Service Window</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 12pm - 2pm, 7pm - 10pm"
                        value={formData.peakHours}
                        onChange={(e) => updateForm('peakHours', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {step === 4 && (
              <StepWrapper 
                key="step4"
                title="Menu & Challenges"
                description="Define your product architecture and the obstacles preventing optimal efficiency."
                onNext={nextStep}
              >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Menu Categories</label>
                        <textarea 
                          placeholder="Appetizers, Large Plates, Wine List..."
                          rows={2}
                          value={formData.menuCategories}
                          onChange={(e) => updateForm('menuCategories', e.target.value)}
                          className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Inventory Pain Points</label>
                        <select 
                          value={formData.inventoryChallenges}
                          onChange={(e) => updateForm('inventoryChallenges', e.target.value)}
                          className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium appearance-none"
                        >
                          <option>High wastage in fresh produce</option>
                          <option>Inaccurate stock tracking</option>
                          <option>Frequent out-of-stock items</option>
                          <option>Supplier delivery delays</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Signature High-Margin Items</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Lobster Risotto, Aged Steak"
                          value={formData.signatureItems}
                          onChange={(e) => updateForm('signatureItems', e.target.value)}
                          className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Pricing Philosophy</label>
                        <div className="grid grid-cols-2 gap-3">
                         {['Premium', 'Mid-tier', 'Value-driven', 'Dynamic'].map(p => (
                           <button 
                             key={p}
                             onClick={() => updateForm('pricingStyle', p)}
                             className={cn(
                               "py-3 rounded-xl border transition-all text-[10px] font-black uppercase",
                               formData.pricingStyle === p 
                                ? "bg-orange-500 border-orange-500 text-white" 
                                : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-500"
                             )}
                           >
                             {p}
                           </button>
                         ))}
                       </div>
                      </div>
                    </div>
                 </div>
              </StepWrapper>
            )}

            {step === 5 && (
              <StepWrapper 
                key="step5"
                title="Strategic Goals"
                description="Finalize your business objectives. Our AI uses these to weigh its recommendations."
                onNext={nextStep}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Primary Growth Goal</label>
                      <select 
                        value={formData.businessGoals}
                        onChange={(e) => updateForm('businessGoals', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-all font-medium appearance-none"
                      >
                        <option>Scaling to multiple locations</option>
                        <option>Increasing average check size</option>
                        <option>Reducing operational overhead</option>
                        <option>Improving customer retention</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Target Analytics Focus</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'profit', label: 'Profit Margin Optimization', icon: Zap },
                          { id: 'labor', label: 'Labor Efficiency Analysis', icon: Users },
                          { id: 'market', label: 'Market Sentiment Scan', icon: Sparkles }
                        ].map(opt => (
                          <button 
                            key={opt.id}
                            onClick={() => updateForm('preferredAnalytics', opt.label)}
                            className={cn(
                              "p-4 rounded-2xl border flex items-center gap-4 transition-all",
                              formData.preferredAnalytics === opt.label 
                                ? "bg-orange-500/10 border-orange-500 text-orange-500" 
                                : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-500"
                            )}
                          >
                            <opt.icon className="w-5 h-5" />
                            <span className="text-sm font-bold">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <BrainCircuit className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <h4 className="text-2xl font-black tracking-tighter">OS Initialization Ready</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">By finalizing these goals, your AI instance will generate a custom strategic roadmap and initialize its neural monitoring layers.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-mono text-zinc-500">
                      // Status: All mandatory sectors configured<br/>
                      // Profile: High Velocity / Growth Tier
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {step === 6 && (
              <StepWrapper 
                key="step6"
                title="System Deployment"
                description="Your DineDesk environment is being provisioned."
                onNext={nextStep}
                showNext={false}
              >
                <div className="flex flex-col items-center justify-center py-12 space-y-8">
                  <div className="relative">
                    <motion.div 
                      className="w-40 h-40 rounded-full border-4 border-orange-500/20 flex items-center justify-center p-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-full h-full rounded-full border-4 border-t-orange-500 border-transparent shadow-[0_0_20px_rgba(249,115,22,0.3)]" />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Zap className="w-12 h-12 text-orange-500" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">CALIBRATING NEURAL CORES</h3>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">Assigning business context to AI Copilot...</p>
                  </div>

                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    onClick={() => {
                      const userKey = auth.currentUser?.email || JSON.parse(sessionStorage.getItem('demo_user') || '{}').email || '';
                      if (userKey) {
                        sessionStorage.setItem(`onboarding_data_${userKey}`, JSON.stringify(formData));
                      } else {
                        sessionStorage.setItem('onboarding_data', JSON.stringify(formData));
                      }
                      onFinish();
                    }}
                    className="px-16 py-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-2xl shadow-2xl hover:scale-105 transition-all"
                  >
                    ENTER OS
                  </motion.button>
                </div>
              </StepWrapper>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation Overlay */}
      {step < totalSteps && (
        <div className="fixed bottom-12 left-0 right-0 px-20 flex justify-between items-center pointer-events-none">
           {step > 1 ? (
             <button 
              onClick={prevStep}
              className="px-8 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-500 text-xs font-black uppercase tracking-widest hover:bg-black/10 transition-all pointer-events-auto"
             >
               Back
             </button>
           ) : <div />}
        </div>
      )}
    </div>
  );
};
