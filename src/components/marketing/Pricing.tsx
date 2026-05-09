/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Check, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Star,
  BrainCircuit,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  recommended = false,
  onSelect,
  icon: Icon
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      "p-8 md:p-12 rounded-[3.5rem] relative flex flex-col transition-all group",
      recommended 
        ? "bg-[#0A0A0B] border-2 border-orange-500 text-white shadow-2xl scale-105 z-10" 
        : "bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white"
    )}
  >
    {recommended && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-orange-500 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/50">
        Most Predictive Value
      </div>
    )}

    <div className="mb-10 text-center">
      <div className={cn(
        "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform",
        recommended ? "bg-orange-500/10 text-orange-500" : "bg-black/5 dark:bg-white/5 text-zinc-500"
      )}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">{title}</h3>
      <p className={cn("text-sm", recommended ? "text-zinc-400" : "text-zinc-500")}>
        {description}
      </p>
    </div>

    <div className="mb-12 text-center">
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-sm font-black uppercase">$</span>
        <span className="text-7xl font-black tracking-tighter">{price}</span>
        <span className={cn("text-xs font-bold uppercase", recommended ? "text-zinc-500" : "text-zinc-500")}>/ month</span>
      </div>
    </div>

    <div className="flex-1 space-y-5 mb-12">
      {features.map((f: string, i: number) => (
        <div key={i} className="flex gap-4 items-start text-sm font-medium">
          <div className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
            recommended ? "bg-orange-500 text-white" : "bg-black/5 dark:bg-white/5 text-zinc-500"
          )}>
            <Check className="w-3 h-3" strokeWidth={4} />
          </div>
          <span className={recommended ? "text-zinc-300" : "text-zinc-500"}>{f}</span>
        </div>
      ))}
    </div>

    <button 
      onClick={onSelect}
      className={cn(
        "w-full py-5 rounded-full font-black text-lg transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        recommended 
          ? "bg-orange-500 text-white shadow-orange-500/20" 
          : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-black/10 dark:shadow-white/10"
      )}
    >
      Start Your AI Trial
    </button>
  </motion.div>
);

export const Pricing = ({ onSelectPlan }: { onSelectPlan: (plan: string) => void }) => {
  return (
    <div className="py-32 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-24 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-black tracking-[0.2em] uppercase">
          <Sparkles className="w-4 h-4 fill-orange-500" />
          Neural Plans for Every Scale
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
          Invest in Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-500">
            Business Intelligence
          </span>
        </h2>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
          Choose a plan that matches your ambition. No hidden fees, just pure neural power.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-20">
        <PricingCard 
          title="Starter"
          price="49"
          description="Perfect for independent cafes and boutique bistros."
          icon={MessageCircle}
          features={[
            'Core POS & Invoicing',
            'Basic AI Insights (3/day)',
            'Inventory Tracker',
            '10 Staff Accounts',
            'Email Support'
          ]}
          onSelect={() => onSelectPlan('starter')}
        />
        <PricingCard 
          recommended={true}
          title="Neural Growth"
          price="149"
          description="The professional standard for high-volume restaurants."
          icon={BrainCircuit}
          features={[
            'Full Intelligence Dashboard',
            '7-Day Demand Forecasting',
            'Competitor Price Monitoring',
            'Dynamic Pricing Engine',
            'Multi-terminal Sync',
            '24/7 Priority Support'
          ]}
          onSelect={() => onSelectPlan('growth')}
        />
        <PricingCard 
          title="Enterprise AI"
          price="499"
          description="For restaurant chains and scaling cloud kitchen brands."
          icon={BarChart3}
          features={[
            'Unlimited Branches',
            'Advanced Supply Chain AI',
            'Custom Neural Models',
            'Whitelabel Customer App',
            'Dedicated Architect',
            'On-site Deployment'
          ]}
          onSelect={() => onSelectPlan('enterprise')}
        />
      </div>

      <div className="mt-32 p-12 md:p-20 rounded-[4rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
           {[
             { label: 'Platform Uptime', val: '99.98%', desc: 'Carrier-grade reliability.' },
             { label: 'Data Security', val: 'Encrypted', desc: 'Enterprise-standard protection.' },
             { label: 'Setup Time', val: '~48 Hours', desc: 'Fast neural integration.' },
             { label: 'Avg ROI', val: '+24%', desc: 'Within the first 90 days.' },
           ].map((stat, i) => (
             <div key={i} className="space-y-2">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</h4>
                <p className="text-3xl font-black text-zinc-900 dark:text-white uppercase">{stat.val}</p>
                <p className="text-xs text-zinc-500 font-medium">{stat.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
