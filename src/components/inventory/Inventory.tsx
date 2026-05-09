/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  RefreshCw, 
  Search,
  ShoppingCart,
  Minus,
  Plus,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Star,
  Info,
  Sparkles
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { dataService, useOperationalData } from '@/services/dataService';
import { motion, AnimatePresence } from 'motion/react';

const InsightCard = ({ title, category, message, type }: { title: string; category: string; message: string; type: 'risk' | 'opportunity' | 'info' }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="p-5 rounded-[2rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm"
  >
    <div className="flex items-start gap-4">
      <div className={cn(
        "p-3 rounded-2xl",
        type === 'risk' ? "bg-rose-500/10 text-rose-500" : 
        type === 'opportunity' ? "bg-emerald-500/10 text-emerald-500" : 
        "bg-indigo-500/10 text-indigo-500"
      )}>
        {type === 'risk' ? <AlertTriangle className="w-5 h-5" /> : type === 'opportunity' ? <Zap className="w-5 h-5" /> : <Info className="w-5 h-5" />}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{category}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Neural Sync</span>
        </div>
        <h4 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{message}</p>
      </div>
    </div>
  </motion.div>
);

export const Inventory = () => {
  const { inventory, menu } = useOperationalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'low-stock' | 'high-performer'>('all');

  const handleUpdateStock = async (id: string, current: number, delta: number) => {
    const newVal = Math.max(0, current + delta);
    await dataService.updateStock(id, newVal);
  };

  const combinedItems = [
    ...inventory.map(item => ({ 
      ...item, 
      type: 'material' as const,
      popularity: 'Medium' as const,
      price: 0,
      cost: 0,
      image: item.image || ''
    })),
    ...menu.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.stockLevel,
      unit: 'serv',
      reorderPoint: 10,
      status: item.stockLevel <= 5 ? 'Critical' : item.stockLevel <= 10 ? 'Low' : 'Healthy' as any,
      type: 'menu' as const,
      popularity: item.popularity,
      price: item.price,
      cost: item.cost,
      image: item.image || ''
    }))
  ];

  const filteredItems = combinedItems
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => {
      if (activeTab === 'low-stock') return item.status !== 'Healthy';
      if (activeTab === 'high-performer') return item.popularity === 'High';
      return true;
    });

  const stats = {
    totalValue: combinedItems.reduce((acc, item) => acc + (item.type === 'menu' ? item.price : 10) * item.quantity, 0),
    atRisk: combinedItems.filter(item => item.status !== 'Healthy').length,
    highPerformers: combinedItems.filter(item => item.popularity === 'High').length
  };

  const insights = [
    { title: "Stockout Pending", category: "Inventory Risk", type: "risk" as const, message: "Wagyu Beef Paties will be depleted in 4.2 hours based on high weekend demand." },
    { title: "Profit Optimization", category: "Neural Insights", type: "opportunity" as const, message: "Yuzu Cheesecake has a 70% margin. Increasing visibility on menu could boost daily net profit by $120." },
    { title: "Waste Mitigation", category: "Sustainability", type: "info" as const, message: "Caesar Salad prep volume exceeds demand by 12%. Adjusting prep-sheet suggested." }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-(--breakpoint-2xl) mx-auto">
      <div className="lg:flex justify-between items-end gap-6 space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-orange-500 text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Neural Operational Mesh</span>
          </div>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter flex items-center gap-3">
            Inventory Central
            <Package className="w-8 h-8 text-orange-500" />
          </h2>
          <p className="text-zinc-500 mt-1 max-w-lg font-medium">Executive command center monitoring stock efficacy and profitability thresholds across your entire neural supply chain.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
             <ShoppingCart className="w-4 h-4" /> Bulk Procurement
           </button>
           <button className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-500 hover:text-orange-500 transition-colors">
             <RefreshCw className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Asset Value', val: formatCurrency(stats.totalValue), icon: Package, color: 'text-indigo-500', trend: '+12%' },
          { label: 'Risk Indices', val: stats.atRisk.toString(), icon: AlertTriangle, color: 'text-rose-500', trend: '-2' },
          { label: 'Efficiency', val: '94.2%', icon: TrendingUp, color: 'text-emerald-500', trend: '+0.5%' },
          { label: 'High Performers', val: stats.highPerformers.toString(), icon: Star, color: 'text-orange-500', trend: 'Steady' },
        ].map((kpi, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-black/5 dark:bg-white/5", kpi.color)}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{kpi.trend}</span>
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1 tracking-tighter">{kpi.val}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[3rem] bg-white dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-10">
              <div className="flex flex-wrap bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl self-start">
                {(['all', 'low-stock', 'high-performer'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-lg" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-2xl border border-black/5 dark:border-white/5 w-full lg:w-64 group focus-within:border-orange-500/50 transition-all">
                   <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-orange-500" />
                   <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search supply chain..." 
                    className="bg-transparent border-none outline-none text-xs font-bold text-zinc-900 dark:text-white w-full" 
                   />
                 </div>
              </div>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] border-b border-black/5 dark:border-white/5">
                    <th className="pb-6 px-4">Entity</th>
                    <th className="pb-6 px-4 text-center">In-Stock</th>
                    <th className="pb-6 px-4">Intelligence</th>
                    <th className="pb-6 px-4 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={item.id} 
                        className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-white/5 border border-black/5 dark:border-white/5 flex-shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                  <Package className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.type}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                <span className={cn(
                                  "text-[10px] font-black uppercase",
                                  item.popularity === 'High' ? "text-orange-500" : "text-zinc-400"
                                )}>{item.popularity} Popularity</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <span className={cn(
                            "text-xl font-black tracking-widest",
                            item.status === 'Critical' ? "text-rose-500" : "text-zinc-900 dark:text-white"
                          )}>{item.quantity}</span>
                          <span className="text-[10px] font-bold text-zinc-400 ml-1 uppercase">{item.unit}</span>
                          <div className="mt-1 h-1 w-24 bg-black/5 dark:bg-white/5 rounded-full mx-auto overflow-hidden">
                             <div 
                              className={cn(
                                "h-full transition-all duration-1000",
                                item.status === 'Critical' ? "bg-rose-500" : item.status === 'Low' ? "bg-orange-500" : "bg-emerald-500"
                              )} 
                              style={{ width: `${Math.min(100, (item.quantity / (item.reorderPoint * 2)) * 100)}%` }} 
                             />
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                item.status === 'Critical' ? "bg-rose-500 animate-pulse" : 
                                item.status === 'Low' ? "bg-orange-500" :
                                "bg-emerald-500"
                              )} />
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                item.status === 'Critical' ? "text-rose-500" : 
                                item.status === 'Low' ? "text-orange-500" :
                                "text-emerald-500"
                              )}>{item.status} Health</span>
                            </div>
                            {item.type === 'menu' && (
                              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                                Margin: {Math.round(((item.price - item.cost) / item.price) * 100)}%
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleUpdateStock(item.id, item.quantity, -1)}
                              className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90"
                            >
                              <Minus className="w-4 h-4 mx-auto" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStock(item.id, item.quantity, 1)}
                              className="w-10 h-10 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-110 active:scale-95 transition-all"
                            >
                              <Plus className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px] rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-1000" />
            <Sparkles className="w-8 h-8 mb-6 text-white/50" />
            <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">Neural Inventory Optimization</h3>
            <p className="text-sm text-white/80 mt-4 leading-relaxed font-medium">System is currently analyzing demand vectors. 3 operational optimizations available.</p>
            <button className="mt-8 w-full py-4 rounded-2xl bg-white text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-colors shadow-xl">
              Execute Optimization
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-4">AI Intelligence Stream</h4>
            {insights.map((insight, idx) => (
              <InsightCard key={idx} {...insight} />
            ))}
          </div>

          <div className="p-8 rounded-[3rem] bg-zinc-900 border border-white/5 space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" /> Supply Velocity
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Meat/Protein', val: 78 },
                { label: 'Produce', val: 92 },
                { label: 'Dry Goods', val: 45 },
              ].map(v => (
                <div key={v.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span>{v.label}</span>
                    <span>{v.val}% Velocity</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${v.val}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-orange-500" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
