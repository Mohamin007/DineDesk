/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  Phone,
  Mail,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const customers = [
  { id: '1', name: 'Alice Johnson', visits: 12, spent: 450, favorite: 'Wagyu Burger', status: 'VIP' },
  { id: '2', name: 'Bob Smith', visits: 4, spent: 120, favorite: 'Margherita Pizza', status: 'Regular' },
  { id: '3', name: 'Charlie Davis', visits: 22, spent: 890, favorite: 'Truffle Pasta', status: 'VIP' },
  { id: '4', name: 'Diana Prince', visits: 1, spent: 45, favorite: 'Cocktail', status: 'New' },
];

export const CRM = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-(--breakpoint-2xl) mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            Guest Experience
            <Users className="w-6 h-6 text-indigo-500" />
          </h2>
          <p className="text-zinc-500 mt-1">Manage relationships and personal preferences at scale with AI guest profiles.</p>
        </div>
        <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5">
           <button className="px-4 py-2 rounded-lg bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white text-xs font-bold">All Guests</button>
           <button className="px-4 py-2 rounded-lg text-zinc-500 text-xs font-bold">Reservation Waitlist</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Guests', val: '1,284', delta: '+12%' },
          { label: 'CLV (Avg)', val: '$145', delta: '+5%' },
          { label: 'Retention', val: '64%', delta: '+2%' },
          { label: 'Sentiment', val: '4.8/5', delta: '+0.1' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{stat.val}</h3>
              <span className="text-[10px] font-bold text-emerald-500">{stat.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Frequent Guests</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5">
                    <Search className="w-3 h-3 text-zinc-500" />
                    <input type="text" placeholder="Search guests..." className="bg-transparent border-none outline-none text-xs text-zinc-900 dark:text-white w-32" />
                  </div>
                  <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
             </div>

             <div className="space-y-4">
                {customers.map((guest) => (
                  <div key={guest.id} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-4 hover:border-indigo-500/30 transition-all cursor-pointer group shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black">
                      {guest.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-zinc-900 dark:text-white">{guest.name}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                          guest.status === 'VIP' ? "bg-orange-500/10 text-orange-500 border border-orange-500/30" : "bg-black/5 dark:bg-white/10 text-zinc-500"
                        )}>
                          {guest.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Favorite: {guest.favorite}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm font-black text-zinc-900 dark:text-white">${guest.spent}</p>
                      <p className="text-[10px] text-zinc-500 font-mono italic">{guest.visits} visits</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-zinc-500 hover:text-indigo-500 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-zinc-500 hover:text-indigo-500 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 rounded-3xl bg-[#111113] border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                <Zap className="w-32 h-32 text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Guest AI Insights</h3>
              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Churn Risk Alert</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      3 Regular guests haven't visited in 14 days. This is 40% higher than average.
                    </p>
                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-xl transition-all">
                      SEND RETENTION EMAIL
                    </button>
                 </div>
                 <div className="pt-6 border-t border-white/5 space-y-2">
                    <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">High Value Opportunity</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      "Charlie Davis" has visited 22 times. AI suggests offering a private tasting session.
                    </p>
                 </div>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-widest">Feedback Stream</h3>
              <div className="space-y-4">
                 {[
                   { user: 'Sarah M.', text: 'The truffle pasta was life-changing!', rate: 5 },
                   { user: 'Mark K.', text: 'Slight delay on delivery, but food was hot.', rate: 4 },
                 ].map((rev, i) => (
                   <div key={i} className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-white">{rev.user}</span>
                        <div className="flex gap-0.5">
                           {[...Array(rev.rate)].map((_, i) => <Star key={i} className="w-2 h-2 fill-orange-500 text-orange-500" />)}
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 italic">"{rev.text}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
