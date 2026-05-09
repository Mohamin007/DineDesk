/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  BrainCircuit, 
  Sparkles,
  Bot,
  User,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { aiService, ChatMessage } from '@/services/aiService';
import Markdown from 'react-markdown';

export const CopilotChat = ({ isOpen, onClose, activeTab }: { isOpen: boolean, onClose: () => void, activeTab: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.chat([...messages, userMessage], { 
        currentView: activeTab,
        browserTimestamp: new Date().toISOString()
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the neural network. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white dark:bg-[#0A0A0B] border border-black/10 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-zinc-900 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-20 h-20" />
            </div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black tracking-tight text-sm">Neural Copilot</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI Ready
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-zinc-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
                <div className="p-4 bg-orange-500/10 rounded-full">
                  <Sparkles className="w-10 h-10 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-900 dark:text-white">How can I help your business?</h4>
                  <p className="text-xs text-zinc-500">Ask about demand forecasting, menu optimization, or profit analysis.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {[
                    "What should I promote tonight?",
                    "Analyze weekend demand",
                    "Which items have high profit?"
                  ].map(v => (
                    <button 
                      key={v}
                      onClick={() => { setInput(v); }}
                      className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-left"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-3",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                  msg.role === 'user' 
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-black/10" 
                    : "bg-orange-500 text-white border-orange-400"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-4 rounded-[1.5rem] text-sm leading-relaxed max-w-[85%]",
                  msg.role === 'user' 
                    ? "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white rounded-tr-none" 
                    : "bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-300 rounded-tl-none shadow-sm"
                )}>
                  <div className="markdown-body">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 border border-orange-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-[1.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Neural Scan...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02]">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Ask Neural Copilot..."
                className="w-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 pr-14 text-sm text-zinc-900 dark:text-white outline-none focus:border-orange-500/50 shadow-sm transition-all"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-3 rounded-xl bg-orange-500 text-white hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
