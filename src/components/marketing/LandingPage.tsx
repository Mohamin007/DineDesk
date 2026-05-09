/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  LineChart, 
  Users, 
  Package, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  PieChart,
  BarChart4
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-orange-500/30 transition-all group"
  >
    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export const LandingPage = ({ onStartAnalysis, onLogin }: { onStartAnalysis: () => void, onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-500">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md bg-white/70 dark:bg-[#0A0A0B]/70 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">DineDesk</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Intelligence', 'Pricing', 'Enterprise'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Sign In</button>
          <button onClick={onStartAnalysis} className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:scale-105 transition-transform shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Analyze My Restaurant
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/20 blur-[160px] rounded-full -z-10 animate-pulse" />
        <div className="absolute top-40 right-40 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs font-black text-orange-500 uppercase tracking-widest mb-10">
            <Sparkles className="w-4 h-4 fill-orange-500" />
            Empowering 20,000+ Modern Kitchens
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.95] mb-8">
            The Operating System <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-500">
              For AI-Driven Dining
            </span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Move beyond legacy POS systems. DineDesk AI uses neural forecasting and real-time competitor intelligence to optimize your revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStartAnalysis}
              className="group relative px-10 py-5 rounded-full bg-orange-500 text-white font-black text-lg shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:scale-105 transition-all overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-3">
                Analyze My Restaurant <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={onLogin}
              className="px-10 py-5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white font-black text-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all"
            >
              Enter the OS
            </button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-24 max-w-6xl mx-auto rounded-[3rem] border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0B] shadow-2xl p-4 relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/20 via-transparent to-indigo-500/20 blur-xl opacity-50" />
          <div className="relative rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5 aspect-[16/9] bg-[#0A0A0B]">
             <img 
               src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675" 
               alt="Dashboard Preview" 
               className="w-full h-full object-cover opacity-60"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-10 rounded-[3rem] bg-black/60 backdrop-blur-2xl border border-white/10 max-w-md text-left">
                  <div className="flex items-center gap-3 mb-6">
                    <BrainCircuit className="w-8 h-8 text-orange-500" />
                    <span className="text-white font-black uppercase tracking-widest text-xs">AI Insight Model v4.2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">"Matcha demand rising +45% in your area this weekend."</h3>
                  <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase">Apply Pricing Update</button>
                    <button className="px-5 py-2 rounded-xl bg-white/10 text-white text-xs font-bold uppercase">View Local Trends</button>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">Built for High-Growth Kitchens</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">Complete neural orchestration for every layer of your restaurant business.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={TrendingUp} 
            title="Demand Forecasting" 
            description="Our neural engine predicts order density 7 days in advance with 94% accuracy, accounting for weather and local events."
            delay={0.1}
          />
          <FeatureCard 
            icon={Package} 
            title="Smart Inventory" 
            description="Automated stock reconciliation and wastage alerts. We predict shortages before your chefs do."
            delay={0.2}
          />
          <FeatureCard 
            icon={BarChart4} 
            title="Competitive Intel" 
            description="Real-time scanning of competitor pricing, menu updates, and social buzz in your 3km radius."
            delay={0.3}
          />
          <FeatureCard 
            icon={Users} 
            title="Neural CRM" 
            description="Individual guest profiling at scale. Predict guest churn and automate personalized retention offers."
            delay={0.4}
          />
          <FeatureCard 
            icon={PieChart} 
            title="Dynamic Pricing" 
            description="Max-revenue algorithms that adjust item prices based on real-time demand shifts and kitchen load."
            delay={0.5}
          />
          <FeatureCard 
            icon={BrainCircuit} 
            title="AI Business Copilot" 
            description="A floating expert that answers: 'Why are my profit margins down 4% this week?' with actionable fixes."
            delay={0.6}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto p-12 md:p-24 rounded-[4rem] bg-[#0A0A0B] relative overflow-hidden text-center border border-white/5">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-tight">
              Ready to Upgrade Your <br />
              Restaurant's Intelligence?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onStartAnalysis}
                className="px-12 py-6 rounded-full bg-white text-zinc-900 font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Analyze My Restaurant
              </button>
              <button className="px-12 py-6 rounded-full bg-white/5 border border-white/5 text-white font-black text-xl hover:bg-white/10 transition-all">
                Talk to Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-orange-500" />
              <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">DineDesk</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              The world's first AI-native restaurant operating system. Built for the future of hospitality.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { title: 'Product', links: ['Dashboard', 'Intelligence', 'KDS', 'Pricing'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-widest">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-zinc-500 hover:text-orange-500 transition-colors uppercase font-mono tracking-tighter">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
          <span>© 2026 DineDesk AI Inc.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
