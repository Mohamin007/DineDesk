import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Zap, 
  Sparkles,
  Eye, 
  EyeOff,
  Star,
  UtensilsCrossed,
  X,
  Save,
  Clock,
  DollarSign,
  Package,
  Tag,
  Layers,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '@/lib/utils';
import { dataService, useOperationalData, MenuItem } from '@/services/dataService';
import { ProfitAudit } from './ProfitAudit';
import { ComboSuggestions } from './ComboSuggestions';

const DishCard = ({ dish, onEdit, onDelete }: { dish: any; onEdit: (dish: any) => void; onDelete: (id: string) => void }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all transition-colors duration-300 shadow-sm dark:shadow-none relative"
  >
    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={() => onEdit(dish)}
        className="p-2 rounded-xl bg-white/90 dark:bg-black/60 backdrop-blur-md text-zinc-600 dark:text-zinc-300 hover:text-orange-500 transition-colors shadow-lg"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onDelete(dish.id)}
        className="p-2 rounded-xl bg-white/90 dark:bg-black/60 backdrop-blur-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

    <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
      {dish.image ? (
        <img 
          src={dish.image} 
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="text-zinc-400 group-hover:scale-110 transition-transform duration-500">
          <UtensilsCrossed className="w-12 h-12" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
          {dish.category}
        </span>
        {dish.popularity === 'High' && (
          <span className="px-2 py-1 rounded-lg bg-orange-500 text-[10px] font-bold text-white flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" /> Trending
          </span>
        )}
      </div>
    </div>

    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors uppercase leading-tight">
          {dish.name}
        </h3>
        <span className="text-lg font-black text-zinc-900 dark:text-white">
          {formatCurrency(dish.price)}
        </span>
      </div>
      
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2 leading-relaxed">
        Ingredients: {dish.ingredients.join(', ')}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-4">
          <button className={cn(
             "flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors",
             dish.stockLevel > 0 ? "text-emerald-500" : "text-rose-500"
          )}>
            {dish.stockLevel > 0 ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {dish.stockLevel > 0 ? 'In Stock' : 'Out of Stock'}
          </button>
        </div>
        <div className="flex items-center gap-2">
           <div className="text-right">
             <p className="text-[10px] text-zinc-500 uppercase font-mono leading-none mb-1">Stock Level</p>
             <p className="text-sm font-bold text-zinc-900 dark:text-white">{dish.stockLevel}</p>
           </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const MenuEditorModal = ({ 
  item, 
  onClose, 
  onSave 
}: { 
  item?: MenuItem | null; 
  onClose: () => void; 
  onSave: (data: any) => void 
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    item || {
      name: '',
      category: 'Burgers',
      price: 0,
      cost: 0,
      popularity: 'Medium',
      ingredients: [],
      stockLevel: 0,
      description: '',
      prepTime: '',
      tags: [],
      image: ''
    }
  );

  const [ingredientInput, setIngredientInput] = useState(item?.ingredients?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      ingredients: ingredientInput.split(',').map(s => s.trim()).filter(s => s)
    };
    onSave(finalData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/5"
      >
        <div className="p-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-white/5">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              {item ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Intelligence Layer v2</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Product Image URL</label>
              <div className="relative group">
                <input 
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all pl-12"
                  placeholder="https://images.unsplash.com/..."
                />
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-orange-500" />
              </div>
            </div>
            
            {formData.image && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-32 rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-inner"
              >
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Image Preview</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Item Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all"
                placeholder="Ex: Spicy Korean Burger"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all appearance-none"
              >
                {['Burgers', 'Pizza', 'Noodles', 'Salads', 'Desserts', 'Drinks', 'Sides', 'Starters'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> Sale Price
              </label>
              <input 
                type="number" step="0.01" required
                value={isNaN(Number(formData.price)) ? 0 : formData.price}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setFormData({ ...formData, price: isNaN(val) ? 0 : val });
                }}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Target className="w-3 h-3" /> Food Cost
              </label>
              <input 
                type="number" step="0.01" required
                value={isNaN(Number(formData.cost)) ? 0 : formData.cost}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setFormData({ ...formData, cost: isNaN(val) ? 0 : val });
                }}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Package className="w-3 h-3" /> Initial Stock
              </label>
              <input 
                type="number" required
                value={isNaN(Number(formData.stockLevel)) ? 0 : formData.stockLevel}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  setFormData({ ...formData, stockLevel: isNaN(val) ? 0 : val });
                }}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ingredients (Comma Separated)</label>
            <div className="relative">
              <input 
                value={ingredientInput}
                onChange={e => setIngredientInput(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all"
                placeholder="Ex: Brioche bun, Kimchi mayo, Crispy chicken..."
              />
              <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {ingredientInput.split(',').map(s => s.trim()).filter(s => s).map((ing, idx) => (
                <span key={idx} className="px-2 py-1 rounded-lg bg-orange-500/10 text-orange-600 text-[10px] font-bold border border-orange-500/20">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Prep Time
              </label>
              <input 
                value={formData.prepTime}
                onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all"
                placeholder="Ex: 12-15 mins"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Popularity
              </label>
              <select 
                value={formData.popularity}
                onChange={e => setFormData({ ...formData, popularity: e.target.value as any })}
                className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl p-4 text-sm font-bold transition-all appearance-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-3xl p-4 text-sm font-bold transition-all min-h-[100px] resize-none"
              placeholder="Tell the story of this dish..."
            />
          </div>
        </form>

        <div className="p-8 border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-white/5 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-black/5 dark:border-white/5 font-bold text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-2 px-8 py-4 rounded-2xl bg-orange-500 text-white font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Save className="w-5 h-5" />
            {item ? 'Save Changes' : 'Create Item'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const MenuManagement = () => {
  const { menu } = useOperationalData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAudit, setShowAudit] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...new Set(menu.map(d => d.category))];
  
  const handleAdd = () => setEditingItem(null);
  const handleEdit = (item: MenuItem) => setEditingItem(item);
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      await dataService.deleteMenuItem(id);
    }
  };

  const handleSave = async (data: any) => {
    if (editingItem?.id) {
      await dataService.updateMenuItem(editingItem.id, data);
    } else {
      await dataService.addMenuItem(data);
    }
    setEditingItem(undefined);
  };

  const filteredDishes = menu
    .filter(d => activeCategory === 'All' || d.category === activeCategory)
    .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:flex justify-between items-end gap-6 space-y-6 lg:space-y-0">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
            Menu Studio
            <span className="text-xs font-bold px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full animate-pulse">LIVE</span>
          </h2>
          <p className="text-zinc-500 mt-2 max-w-md">
            Design your dining experience with high-fidelity operational data and neural intelligence.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 text-white font-black hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            New Item
          </button>
          <button 
            onClick={() => setShowCombo(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all"
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Smart Combos
          </button>
          <button 
            onClick={() => setShowAudit(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all"
          >
            <Zap className="w-5 h-5 text-indigo-500" />
            AI Profit Audit
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between border-y border-black/5 dark:border-white/5 py-6">
        <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/5 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeCategory === cat 
                  ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-xl" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Intelligence Mesh..."
            className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-orange-500/50 focus:ring-0 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDishes.map((dish) => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAudit && (
          <ProfitAudit onClose={() => setShowAudit(false)} />
        )}
        {showCombo && (
          <ComboSuggestions onClose={() => setShowCombo(false)} />
        )}
        {editingItem !== undefined && (
          <MenuEditorModal 
            item={editingItem} 
            onClose={() => setEditingItem(undefined)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
