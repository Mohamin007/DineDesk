import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  CloudRain
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { aiService, AIInsight } from '@/services/aiService';
import { dataService } from '@/services/dataService';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '@/lib/utils';
import { auth } from '@/lib/firebase';

const data = [
  { time: '09:00', sales: 400 },
  { time: '10:00', sales: 300 },
  { time: '11:00', sales: 600 },
  { time: '12:00', sales: 1200 },
  { time: '13:00', sales: 1500 },
  { time: '14:00', sales: 1100 },
  { time: '15:00', sales: 800 },
  { time: '16:00', sales: 500 },
  { time: '17:00', sales: 900 },
  { time: '18:00', sales: 1800 },
  { time: '19:00', sales: 2400 },
  { time: '20:00', sales: 2100 },
];

const KPICard = ({ title, value, change, trend, icon: Icon }: any) => (
  <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all group overflow-hidden relative">
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-32 h-32 text-zinc-900 dark:text-white" />
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
        <Icon className="w-5 h-5" />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
        trend === 'up' ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
      )}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <div>
      <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

const AIInsightCard = ({ insight }: { insight: AIInsight }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 relative group"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
        <CloudRain className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{insight.title}</h4>
          <span className="text-[10px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
            92% Confidence
          </span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed mb-3">
          {insight.description}
        </p>
        <button className="text-indigo-400 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
          View Detailed Forecast <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  </motion.div>
);

export const DashboardOverview = () => {
  const [insights, setInsights] = React.useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = React.useState(true);
  const [businessName, setBusinessName] = React.useState('Executive Overview');
  const [stats, setStats] = React.useState(dataService.getStats());
  const [menuItems, setMenuItems] = React.useState(dataService.getMenu().slice(0, 3));

  React.useEffect(() => {
    // Refresh stats if needed, or just use initial from dataService
    setStats(dataService.getStats());
    setMenuItems(dataService.getMenu().sort((a,b) => b.price - a.price).slice(0, 3));
    
    const userKey = auth.currentUser?.email || JSON.parse(sessionStorage.getItem('demo_user') || '{}').email || '';
    const storageKey = userKey ? `onboarding_data_${userKey}` : 'onboarding_data';
    const onboarding = sessionStorage.getItem(storageKey);
    if (onboarding) {
      const data = JSON.parse(onboarding);
      if (data.restaurantName) {
        setBusinessName(data.restaurantName);
      }
    }
  }, []);

  React.useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await aiService.getInsights();
        if (data && Array.isArray(data.insights)) {
          setInsights(data.insights.slice(0, 3));
        } else {
          setInsights([]);
        }
      } catch (e) {
        console.error("Dashboard Insights Error", e);
        setInsights([]);
      } finally {
        setLoadingInsights(false);
      }
    };
    loadInsights();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-(--breakpoint-2xl) mx-auto transition-colors duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">{businessName}</h2>
          <p className="text-zinc-500 mt-1">Intelligent operational intelligence for your restaurant ecosystem.</p>
        </div>
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-black/5 dark:border-white/5">
          <button className="px-4 py-1.5 rounded-md bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white text-xs font-medium">Real-time</button>
          <button className="px-4 py-1.5 rounded-md text-zinc-400 dark:text-zinc-500 text-xs font-medium">Today</button>
          <button className="px-4 py-1.5 rounded-md text-zinc-400 dark:text-zinc-500 text-xs font-medium">Week</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Daily Gross Revenue" 
          value={formatCurrency(stats.dailyRevenue)} 
          change={12.5} 
          trend="up" 
          icon={DollarSign} 
        />
        <KPICard 
          title="Active Occupancy" 
          value={stats.occupancy} 
          change={4.2} 
          trend="up" 
          icon={Users} 
        />
        <KPICard 
          title="Orders Processed" 
          value={stats.activeOrders.toString()} 
          change={2.1} 
          trend="down" 
          icon={ShoppingBag} 
        />
        <KPICard 
          title="Avg Prep Time" 
          value={stats.avgPrepTime} 
          change={8.4} 
          trend="up" 
          icon={Clock} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Live Sales Activity</h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  <span className="text-zinc-600 dark:text-zinc-300">Target Reached</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#52525b" 
                    fontSize={12} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={12} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a', 
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#f97316" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Top Performing Dishes</h3>
              <div className="space-y-4">
                {menuItems.map((dish, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">#{i+1}</div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{dish.name}</p>
                        <p className="text-xs text-zinc-500">{dish.popularity} Demand • ${dish.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-orange-500" />
                        {Math.floor(85 + Math.random() * 15)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Active Staff</h3>
              <div className="space-y-4">
                {[
                  { name: 'Chef Mario', role: 'Kitchen Head', status: 'In Kitchen' },
                  { name: 'Sarah Wilson', role: 'Main Manager', status: 'On Floor' },
                  { name: 'Alex Chen', role: 'Waiter', status: 'Serving' },
                ].map((staff, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">{staff.name[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{staff.name}</p>
                      <p className="text-xs text-zinc-500">{staff.role}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-zinc-400 font-mono uppercase">{staff.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Co-pilot Insights</h3>
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase rounded">Neural Stream</span>
          </div>

          {loadingInsights ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            insights.map((insight, i) => (
              <AIInsightCard key={`${insight.id}-${i}`} insight={insight} />
            ))
          )}

          <div className="p-6 rounded-2xl bg-[#18181b] border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Market Trend Watch
            </h3>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Citywide Trending</p>
                <p className="text-xs font-medium text-zinc-300">"Matcha Latte" demand is up 40% in nearby competitors.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Forecast Event</p>
                <p className="text-xs font-medium text-zinc-300">Local football match tonight at 8 PM. Expect late-night orders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
