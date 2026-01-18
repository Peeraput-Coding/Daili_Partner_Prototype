import React from 'react';
import { LayoutDashboard, ShoppingBag, Wallet, Sparkles, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onRestrictedClick: () => void; // New prop for triggering popup
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen, onRestrictedClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'ภาพรวมร้าน', icon: LayoutDashboard },
    { id: 'orders', label: 'รายการออเดอร์', icon: ShoppingBag },
    { id: 'finance', label: 'การเงิน', icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed lg:static top-0 left-0 z-50 h-screen w-[280px] bg-white shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary tracking-tight">Daili Partner</h1>
              <p className="text-xs text-grey">ระบบจัดการร้านซักผ้า</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3.5 rounded-[20px] transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "bg-soft-orange text-accent shadow-sm ring-1 ring-accent/20" 
                    : "text-grey hover:bg-soft-blue hover:text-primary"
                )}
              >
                <div className={cn(
                    "p-1.5 rounded-full transition-colors",
                    isActive ? "bg-white/50" : "bg-transparent group-hover:bg-white/50"
                )}>
                    <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
                </div>
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                
                {/* Active Indicator Bubble */}
                {isActive && (
                    <div className="absolute right-3 w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={onRestrictedClick}
             className="w-full flex items-center gap-3 px-5 py-3.5 rounded-[20px] text-grey hover:bg-red-50 hover:text-red-500 transition-colors"
           >
            <LogOut size={20} />
            <span className="font-semibold text-sm">ออกจากระบบ</span>
          </button>
          <div className="mt-4 px-2 text-center">
            <p className="text-[10px] text-gray-300">Daili Partner v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};