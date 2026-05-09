import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  ChevronRight, 
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Order } from '@/types';

const mockOrders: Order[] = [
  {
    id: 'ORD-7721',
    customerName: 'Michael Scott',
    items: [
      { id: 'm1', name: 'Signature Wagyu Burger', quantity: 2, price: 24.50 },
      { id: 'm6', name: 'Craft IPA', quantity: 1, price: 9.50 }
    ],
    totalAmount: 58.50,
    status: 'preparing',
    type: 'dine-in',
    tableNumber: 'Table 4',
    createdAt: new Date(),
    estimatedPrepTime: 12
  },
  {
    id: 'ORD-7722',
    customerName: 'Dwight Schrute',
    items: [
      { id: 'm2', name: 'Truffle Mushroom Pizza', quantity: 1, price: 21.00 }
    ],
    totalAmount: 21.00,
    status: 'pending',
    type: 'takeaway',
    createdAt: new Date(),
    estimatedPrepTime: 8
  },
  {
    id: 'ORD-7723',
    customerName: 'Jim Halpert',
    items: [
      { id: 'm6', name: 'Craft IPA', quantity: 2, price: 9.50 },
      { id: 'm5', name: 'Yuzu Cheesecake', quantity: 1, price: 12.00 }
    ],
    totalAmount: 31.00,
    status: 'ready',
    type: 'delivery',
    createdAt: new Date(),
    estimatedPrepTime: 20
  }
];

const OrderCard = ({ order }: { order: Order; key?: any }) => {
  const statusColors = {
    pending: 'border-zinc-500 text-zinc-500 bg-zinc-500/10',
    preparing: 'border-orange-500 text-orange-500 bg-orange-500/10',
    ready: 'border-emerald-500 text-emerald-400 bg-emerald-400/10',
    delivered: 'border-indigo-500 text-indigo-400 bg-indigo-400/10',
    cancelled: 'border-rose-500 text-rose-500 bg-rose-500/10',
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden group hover:border-black/10 dark:hover:border-white/10 transition-all dark:transition-colors"
    >
      <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border", statusColors[order.status])}>
            {order.status}
          </div>
          <span className="text-xs font-mono text-zinc-500">{order.id}</span>
        </div>
        <button className="p-1 text-zinc-600 hover:text-white transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{order.customerName}</h4>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              {order.type === 'dine-in' ? <UtensilsIcon className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
              {order.type === 'dine-in' ? order.tableNumber : 'Delivery to Downtown'}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-900 dark:text-white">{formatCurrency(order.totalAmount)}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{order.items.length} items</p>
          </div>
        </div>

        <div className="space-y-2 py-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400"><span className="text-zinc-900 dark:text-white font-medium">{item.quantity}x</span> {item.name}</span>
              <span className="text-zinc-500">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 font-mono">
            <Clock className="w-3 h-3" />
            {order.estimatedPrepTime} min
          </div>
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <button className="px-3 py-1 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors">
                Accept
              </button>
            )}
            {order.status === 'preparing' && (
              <button className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors">
                Ready
              </button>
            )}
            {order.status === 'ready' && (
              <button className="px-3 py-1 rounded-lg bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors">
                Deliver
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-orange-500/20 h-1 w-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: order.status === 'preparing' ? '65%' : '100%' }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          className="bg-orange-500 h-full shadow-[0_0_10px_#f97316]"
        />
      </div>
    </motion.div>
  );
};

const UtensilsIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

export const LiveOrders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [orders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter(o => activeFilter === 'all' || o.status === activeFilter);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            Live Stream
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_12px_#f43f5e]" />
          </h2>
          <p className="text-zinc-500 mt-1">Real-time control center for incoming demand.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5">
            {['all', 'pending', 'preparing', 'ready'].map((f) => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider",
                  activeFilter === f ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-lg" : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </AnimatePresence>
      </div>

      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No Active Orders</h3>
          <p className="text-zinc-500 mt-2">All caught up! New orders will appear here automatically.</p>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="fixed bottom-8 right-8">
        <button className="p-4 rounded-full bg-orange-500 text-white shadow-2xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all">
          <CheckCircle2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
