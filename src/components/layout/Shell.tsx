import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  Zap,
  BarChart3,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, isCollapsed }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
      active 
        ? "bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5",
      isCollapsed && "justify-center px-0"
    )}
    title={isCollapsed ? label : ""}
  >
    <Icon className={cn(
      "w-5 h-5 shrink-0",
      active ? "text-orange-500" : "group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
    )} />
    {!isCollapsed && <span className="font-medium text-sm truncate">{label}</span>}
  </button>
);

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed 
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  isCollapsed: boolean 
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        const demoUserJson = localStorage.getItem('demo_user');
        if (demoUserJson) {
           setUser(JSON.parse(demoUserJson));
        } else {
           setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('demo_user');
      window.location.reload(); // Hard reset for clean demo state
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Executive Overview' },
    { id: 'futureProof', icon: Rocket, label: 'Future Readiness' },
    { id: 'alerts', icon: Bell, label: 'Intelligence Alerts' },
    { id: 'orders', icon: ClipboardList, label: 'Live Orders' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu Management' },
    { id: 'inventory', icon: Package, label: 'Inventory (AI)' },
    { id: 'customers', icon: Users, label: 'Customer CRM' },
    { id: 'insights', icon: Zap, label: 'AI Business Co-pilot' },
    { id: 'trends', icon: TrendingUp, label: 'Market Trends' },
    { id: 'analytics', icon: BarChart3, label: 'Advanced Reports' },
    { id: 'integrations', icon: Settings, label: 'Integrations (Exa)' },
  ];

  return (
    <div className={cn(
      "h-screen border-r border-black/5 dark:border-white/5 bg-white dark:bg-[#0A0A0B] flex flex-col p-6 sticky top-0 transition-all duration-300 ease-[0.22,1,0.36,1]",
      isCollapsed ? "w-24 px-4" : "w-72"
    )}>
      <div className={cn("flex items-center gap-3 mb-10", isCollapsed ? "justify-center" : "px-2")}>
        <div className="p-2 bg-orange-500 rounded-lg shrink-0">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 truncate">
            DineDesk
          </h1>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar-sidebar">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 space-y-2">
        <SidebarItem icon={Settings} label="Settings" isCollapsed={isCollapsed} />
        
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 group relative",
          isCollapsed ? "justify-center" : ""
        )}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 shrink-0 object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white border border-black/10 dark:border-white/10 shrink-0">
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                {user?.displayName || 'User'}
              </p>
              <p className="text-[10px] text-zinc-500 truncate lowercase font-mono">
                {user?.email || 'authenticated'}
              </p>
            </div>
          )}

          <button 
            onClick={handleLogout}
            className={cn(
              "p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all",
              isCollapsed ? "absolute -right-12 group-hover:right-0 bg-white dark:bg-[#0A0A0B] border border-black/5 dark:border-white/5 shadow-xl" : ""
            )}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


export const Header = ({ 
  onToggleSidebar, 
  theme, 
  toggleTheme 
}: { 
  onToggleSidebar: () => void, 
  theme: 'light' | 'dark',
  toggleTheme: () => void
}) => (
  <header className="h-16 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8 transition-colors duration-300">
    <div className="flex items-center gap-6">
      <button 
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <LayoutDashboard className="w-5 h-5 rotate-90" />
      </button>

      <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 w-80 lg:w-96">
        <Search className="w-4 h-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search orders, dishes, or asking AI..." 
          className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-300 w-full placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all transform active:scale-95"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <button className="p-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white dark:border-[#0A0A0B]" />
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]">
        <Zap className="w-4 h-4 fill-white" />
        Ask Copilot
      </button>
    </div>
  </header>
);
