/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from './components/layout/Shell';
import { DashboardOverview } from './components/dashboard/Overview';
import { LiveOrders } from './components/orders/LiveOrders';
import { AIInsightsPage } from './components/dashboard/AIInsightsPage';
import { MenuManagement } from './components/menu/MenuManagement';
import { MarketTrends } from './components/trends/MarketTrends';
import { Inventory } from './components/inventory/Inventory';
import { CRM } from './components/crm/CRM';
import { LandingPage } from './components/marketing/LandingPage';
import { AnalyzeRestaurant } from './components/marketing/AnalyzeRestaurant';
import { Pricing } from './components/marketing/Pricing';
import { Auth } from './components/auth/Auth';
import { Onboarding } from './components/onboarding/Onboarding';
import { ExecutiveReport } from './components/dashboard/ExecutiveReport';
import { PredictiveAlerts } from './components/intel/PredictiveAlerts';
import { FutureProofEngine } from './components/intel/FutureProofEngine';
import { Integrations } from './components/settings/Integrations';
import { CopilotChat } from './components/ai/CopilotChat';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, BrainCircuit, X, MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { dataService } from '@/services/dataService';

export default function App() {
  const [view, setView] = useState<'landing' | 'analysis' | 'pricing' | 'signup' | 'signin' | 'onboarding' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsub = dataService.init();
    return () => unsub();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const userKey = currentUser?.email || JSON.parse(sessionStorage.getItem('demo_user') || '{}').email || '';
      const hasOnboarding = userKey ? sessionStorage.getItem(`onboarding_data_${userKey}`) : null;
      
      console.log('[App] Auth Change Detected. View:', view, '| User:', currentUser?.email || 'None', '| Onboarding:', !!hasOnboarding);
      
      // Priority 1: Real Firebase Auth
      if (currentUser) {
        setUser(currentUser as any);
        sessionStorage.removeItem('demo_user'); 
        setIsAuthChecking(false);
        
        // Only auto-redirect from neutral pricing flows, NOT from explicit analysis or signin/signup intents
        if (['pricing'].includes(view)) {
          const target = hasOnboarding ? 'dashboard' : 'onboarding';
          console.log(`[App] Auto-routing to: ${target}`);
          setView(target);
        }
        return;
      }

      // Priority 2: Demo Mode Access (Using sessionStorage for lightweight behavior)
      const demoUserJson = sessionStorage.getItem('demo_user');
      if (demoUserJson) {
        try {
          const demoUser = JSON.parse(demoUserJson);
          setUser(demoUser);
          setIsAuthChecking(false);
          
          const demoKey = demoUser.email || '';
          const hasDemoOnboarding = demoKey ? sessionStorage.getItem(`onboarding_data_${demoKey}`) : null;

          if (['pricing'].includes(view)) {
            const target = hasDemoOnboarding ? 'dashboard' : 'onboarding';
            console.log(`[App] Auto-routing (Demo) to: ${target}`);
            setView(target);
          }
          return;
        } catch (e) {
          console.error('[App] Demo User corruption', e);
          sessionStorage.removeItem('demo_user');
        }
      }

      // Priority 3: No Auth
      setUser(null);
      setIsAuthChecking(false);
      
      // Strict route protection
      const isPublicRoute = ['landing', 'signin', 'signup', 'analysis', 'pricing'].includes(view);
      if (!isPublicRoute) {
        console.log('[App] Guard: Redirecting to landing');
        setView('landing');
      }
    });

    return () => unsubscribe();
  }, [view]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAuthSuccess = () => {
    console.log('[App] handleAuthSuccess triggered');
    const userKey = auth.currentUser?.email || JSON.parse(sessionStorage.getItem('demo_user') || '{}').email || '';
    const hasOnboarding = userKey ? sessionStorage.getItem(`onboarding_data_${userKey}`) : null;
    setView(hasOnboarding ? 'dashboard' : 'onboarding');
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'futureProof':
        return <FutureProofEngine />;
      case 'alerts':
        return (
          <div className="max-w-7xl mx-auto px-8 py-12">
            <PredictiveAlerts />
          </div>
        );
      case 'orders':
        return <LiveOrders />;
      case 'menu':
        return <MenuManagement />;
      case 'inventory':
        return <Inventory />;
      case 'customers':
        return <CRM />;
      case 'insights':
        return <AIInsightsPage />;
      case 'trends':
        return <MarketTrends />;
      case 'analytics':
        return <ExecutiveReport />;
      case 'integrations':
        return <Integrations />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600">
            <Zap className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-xl font-bold italic">Module Implementation Pending</p>
            <p className="text-sm">This section is currently being simulated by our AI Core.</p>
          </div>
        );
    }
  };

  if (isAuthChecking) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center transition-colors duration-300",
        theme === 'dark' ? "dark bg-[#0A0A0B] text-white" : "bg-zinc-50 text-zinc-900"
      )}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-4 bg-orange-500 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.3)] mb-4"
        >
          <Zap className="w-8 h-8 fill-white" />
        </motion.div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 animate-pulse">Initializing OS...</p>
      </div>
    );
  }

  if (view === 'landing') {
    return <LandingPage 
      onStartAnalysis={() => setView('analysis')} 
      onLogin={() => setView('signin')} 
    />;
  }

  if (view === 'analysis') {
    return <AnalyzeRestaurant onFinishAnalysis={() => setView('pricing')} />;
  }

  if (view === 'pricing') {
    return (
      <div className={cn(
        "min-h-screen transition-colors duration-300",
        theme === 'dark' ? "dark bg-[#0A0A0B] text-zinc-100" : "bg-zinc-50 text-zinc-900"
      )}>
        <nav className="p-8 flex justify-between items-center">
           <button onClick={() => setView('landing')} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-orange-500 flex items-center gap-2">
             <X className="w-4 h-4" /> Exit Analysis
           </button>
           <button onClick={toggleTheme} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-500">
             {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
           </button>
        </nav>
        <Pricing onSelectPlan={() => setView('signup')} />
      </div>
    );
  }

  if (view === 'signin') {
    return <Auth mode="signin" onFinish={handleAuthSuccess} />;
  }

  if (view === 'signup') {
    return <Auth mode="signup" onFinish={handleAuthSuccess} />;
  }

  if (view === 'onboarding') {
    return <Onboarding onFinish={() => setView('dashboard')} />;
  }

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300 font-sans selection:bg-orange-500/30 selection:text-orange-500",
      theme === 'dark' ? "dark bg-[#0A0A0B] text-zinc-100" : "bg-zinc-50 text-zinc-900"
    )}>
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden transition-all duration-300">
        {/* Subtle mesh background effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <Header 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {renderDashboardContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Floating AI Copilot */}
        <div className="fixed bottom-8 right-8 z-[100]">
          <CopilotChat 
            isOpen={isCopilotOpen} 
            onClose={() => setIsCopilotOpen(false)} 
            activeTab={activeTab}
          />
          
          <button 
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className="w-14 h-14 rounded-full bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
          >
            {isCopilotOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          </button>
        </div>
      </main>
    </div>
  );
}

