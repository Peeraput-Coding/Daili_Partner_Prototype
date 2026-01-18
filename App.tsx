import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { OrderCard } from './components/OrderCard';
import { EBillModal } from './components/EBillModal';
import { MOCK_ORDERS, MOCK_NOTIFICATIONS } from './constants';
import { Order, OrderStatus } from './types';
import { calculateFinancials, getStatusConfig, formatDateThai } from './lib/utils';
import { Menu, Bell, Search, Filter, TrendingUp, DollarSign, Package, User, LogOut, Mail, CheckCircle2, ChevronDown, Info, X, AlertTriangle, FileText, Users, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie, AreaChart, Area, Sector } from 'recharts';

// --- Sub-components for Popups ---

const ComingSoonModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <AlertTriangle className="text-orange-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">ขออภัยในความไม่สะดวก</h3>
        <p className="text-gray-500 text-sm mb-6">ฟังก์ชันนี้ยังไม่เปิดให้บริการในขณะนี้ <br/>เรากำลังพัฒนาเพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด</p>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-blue-700 transition-colors">รับทราบ</button>
      </div>
    </div>
  );
};

const PolicyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        <div className="bg-primary p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
            <h3 className="text-xl font-bold relative z-10">นโยบายส่วนแบ่งรายได้ (GP)</h3>
            <p className="text-blue-100 text-sm mt-1 relative z-10">ทำไมเราถึงหัก 30% ?</p>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-20"><X size={20}/></button>
        </div>
        <div className="p-8">
            <div className="flex items-center justify-center mb-8">
                 <div className="relative w-40 h-40">
                     {/* CSS-only Pie Chart Representation */}
                     <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center relative overflow-hidden" style={{background: 'conic-gradient(#f17300 0% 83%, #0460b7 83% 100%)'}}>
                        <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-800">30%</span>
                            <span className="text-xs text-grey">Total GP</span>
                        </div>
                     </div>
                 </div>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">25%</div>
                    <div>
                        <p className="font-bold text-gray-800">ค่าขนส่ง (Logistics)</p>
                        <p className="text-xs text-gray-500">ค่าแรงไรเดอร์ พนักงานรับ-ส่งผ้า</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
                     <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">5%</div>
                    <div>
                        <p className="font-bold text-gray-800">การตลาด & ระบบ</p>
                        <p className="text-xs text-gray-500">โฆษณาหาลูกค้า และดูแลระบบแอปฯ</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const NotificationModal = ({ isOpen, onClose, notifications, onReadAll, hasUnread }: { isOpen: boolean; onClose: () => void; notifications: any[]; onReadAll: () => void; hasUnread: boolean }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[70vh]">
         {/* Header */}
         <div className="p-5 border-b border-gray-50 bg-soft-blue/30 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Bell size={20} className="text-primary fill-current"/> การแจ้งเตือน
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white/50 p-1 rounded-full"><X size={20}/></button>
         </div>
         
         {/* List */}
         <div className="overflow-y-auto p-0 flex-1">
            {notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div key={notif.id} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4">
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                            <div>
                                <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{notif.title}</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                    <Clock size={10} /> {notif.time}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-10 text-center text-gray-400">
                    <Bell size={40} className="mx-auto mb-3 opacity-20" />
                    <p>ไม่มีการแจ้งเตือนใหม่</p>
                </div>
            )}
         </div>

         {/* Footer */}
         {hasUnread && notifications.length > 0 && (
             <div className="p-4 border-t border-gray-50 bg-gray-50 text-center shrink-0">
                <button 
                    onClick={onReadAll}
                    className="text-sm text-primary font-bold hover:underline"
                >
                    ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
                </button>
             </div>
         )}
      </div>
    </div>
  );
};

// --- Main App ---

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');

  // UI States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isEBillOpen, setIsEBillOpen] = useState(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);
  
  // Popup States
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  
  // Dashboard Filter States
  const [dashboardTimeRange, setDashboardTimeRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Orders Filter States
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSort, setOrderSort] = useState<'latest' | 'oldest'>('latest');

  // Customer Pie Chart Active Index
  const [pieActiveIndex, setPieActiveIndex] = useState(0);

  // Refs for click outside closing
  const profileRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      // Notif modal handles backdrop click itself, no ref needed for dropdown anymore
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRestrictedAction = () => {
      setShowComingSoon(true);
      setIsProfileOpen(false); // Close dropdown if open
  };

  const handleReadAllNotifs = () => {
      setHasUnreadNotifs(false);
      setIsNotifOpen(false); // Close on read all for better UX in modal mode
  };

  // --- DASHBOARD LOGIC START ---

  // 1. Filter Orders based on Time Range (Global for Dashboard)
  const filteredDashboardOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    let startTime = startOfToday; // Default today
    let endTime = now.getTime();
    
    if (dashboardTimeRange === '7d') {
      startTime = now.getTime() - (7 * 24 * 60 * 60 * 1000);
    } else if (dashboardTimeRange === '30d') {
      startTime = now.getTime() - (30 * 24 * 60 * 60 * 1000);
    } else if (dashboardTimeRange === 'custom' && customStartDate) {
        startTime = new Date(customStartDate).getTime();
        if (customEndDate) {
            endTime = new Date(customEndDate).getTime() + (24 * 60 * 60 * 1000);
        } else {
            endTime = startTime + (24 * 60 * 60 * 1000);
        }
    } else if (dashboardTimeRange === 'today') {
        endTime = now.getTime() + (24 * 60 * 60 * 1000);
    }

    return orders.filter(o => {
        const orderTime = new Date(o.createdAt).getTime();
        
        if (dashboardTimeRange === 'today') {
             const orderDate = new Date(o.createdAt);
             return orderDate.getDate() === now.getDate() && 
                    orderDate.getMonth() === now.getMonth() && 
                    orderDate.getFullYear() === now.getFullYear();
        }

        return orderTime >= startTime && orderTime <= endTime;
    });
  }, [orders, dashboardTimeRange, customStartDate, customEndDate]);

  // 2. Stats Cards Data
  const stats = useMemo(() => {
    const validOrders = filteredDashboardOrders.filter(o => o.status !== 'cancelled');
    const grossSales = validOrders.reduce((sum, o) => sum + o.price.total, 0);
    
    const activeStatuses: OrderStatus[] = ['order_received', 'pickup_in_progress', 'washing', 'drying', 'delivery_in_progress'];
    const activeJobsCount = filteredDashboardOrders.filter(o => activeStatuses.includes(o.status)).length; 

    return {
      activeJobs: activeJobsCount,
      grossSales,
      orderCount: validOrders.length,
    };
  }, [filteredDashboardOrders]);

  // 3. Sales Chart Data (Dynamic Bar Chart) - SORTED
  const salesChartData = useMemo(() => {
      const validOrders = filteredDashboardOrders.filter(o => o.status !== 'cancelled');
      const dataMap = new Map<string, number>();

      if (dashboardTimeRange === 'today') {
          // Hourly grouping for Today - 00:00 to 23:00 (Sorted by hour index)
          const hours = Array(24).fill(0).map((_, i) => ({
             hourIndex: i,
             label: `${String(i).padStart(2, '0')}:00`,
             sales: 0
          }));

          validOrders.forEach(o => {
              const h = new Date(o.createdAt).getHours();
              hours[h].sales += o.price.total;
          });
          
          // Filter to show every 3 hours for cleanliness, but keep data accurate
          // Or just show active hours? Let's show all grouped by 3 hours
          const grouped = [];
          for (let i = 0; i < 24; i+=3) {
              const label = `${String(i).padStart(2, '0')}:00`;
              const sum = hours[i].sales + hours[i+1].sales + hours[i+2].sales;
              grouped.push({ name: label, sales: sum });
          }
          return grouped;

      } else {
          // Daily grouping for 7d, 30d, Custom - Strictly Sorted by Date
          validOrders.forEach(o => {
              // Use ISO date string (YYYY-MM-DD) as key for sorting
              const dateKey = new Date(o.createdAt).toISOString().split('T')[0];
              dataMap.set(dateKey, (dataMap.get(dateKey) || 0) + o.price.total);
          });
          
          // Sort keys (Dates)
          const sortedKeys = Array.from(dataMap.keys()).sort();
          
          // Map to display format
          return sortedKeys.map(key => {
              const d = new Date(key);
              return {
                  name: d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
                  sales: dataMap.get(key) || 0
              };
          });
      }
  }, [filteredDashboardOrders, dashboardTimeRange]);

  // 4. Customer Base Data (Dynamic Pie Chart) - WITH COUNTS
  const customerTypeData = useMemo(() => {
      let newCount = 0;
      let returnCount = 0;
      
      filteredDashboardOrders.forEach(o => {
          const lastDigit = parseInt(o.customerPhone.slice(-1));
          if (lastDigit % 2 === 0) returnCount++;
          else newCount++;
      });
      
      const total = newCount + returnCount;
      if (total === 0) return [
          { name: 'ไม่มีข้อมูล', count: 0, value: 100, color: '#e5e7eb' }
      ];

      // Value is percentage for the Pie slice size
      return [
          { name: 'ลูกค้าประจำ', count: returnCount, value: Math.round((returnCount/total)*100), color: '#0460b7' },
          { name: 'ลูกค้าใหม่', count: newCount, value: Math.round((newCount/total)*100), color: '#f17300' },
      ];
  }, [filteredDashboardOrders]);

  // 5. Hourly Activity Data (Dynamic Area Chart)
  const hourlyActivityData = useMemo(() => {
      const hours = new Array(24).fill(0).map((_, i) => ({ 
          time: `${String(i).padStart(2, '0')}:00`, 
          orders: 0 
      }));

      filteredDashboardOrders.forEach(o => {
          const h = new Date(o.createdAt).getHours();
          hours[h].orders += 1;
      });

      return hours;
  }, [filteredDashboardOrders]);

  // --- DASHBOARD LOGIC END ---

  const handleStatusUpdate = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: newStatus } : o
    ));
  };

  const filteredOrdersList = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (orderSort === 'latest') {
             const activeStatuses = ['order_received', 'pickup_in_progress', 'washing', 'drying', 'delivery_in_progress'];
             const isActiveA = activeStatuses.includes(a.status);
             const isActiveB = activeStatuses.includes(b.status);

             if (isActiveA && !isActiveB) return -1;
             if (!isActiveA && isActiveB) return 1;
             return dateB - dateA; 
        } else {
             return dateA - dateB;
        }
    });
  }, [orders, searchTerm, orderStatusFilter, orderSort]);

  // Render Active Shape for Pie Chart (To show count)
  const onPieEnter = (_: any, index: number) => {
    setPieActiveIndex(index);
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans text-[#333]">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onRestrictedClick={handleRestrictedAction}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md h-[80px] flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-grey"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-bold text-primary hidden sm:block">
              {currentView === 'dashboard' ? 'แดชบอร์ด' : currentView === 'orders' ? 'รายการออเดอร์' : 'สรุปยอดเงิน'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
               <input 
                  type="text"
                  placeholder="ค้นหาออเดอร์..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-full bg-soft-blue border-none text-sm text-gray-700 w-64 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
               />
               <Search className="absolute left-3.5 top-2.5 text-blue-300" size={18} />
            </div>

            {/* Notifications Button (Modified to open Modal) */}
            <div className="relative">
                <button 
                    onClick={() => setIsNotifOpen(true)}
                    className="relative p-2.5 bg-white rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all text-grey hover:text-primary"
                >
                    <Bell size={20} />
                    {hasUnreadNotifs && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                    )}
                </button>
                {/* Dropdown content removed from here */}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform"
                >
                    DP
                </button>
                
                {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                        <div className="p-5 border-b border-gray-50 bg-soft-blue/30 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                                DP
                            </div>
                            <h3 className="font-bold text-gray-800">Daili Partner</h3>
                            <p className="text-xs text-grey">partner@dailiwash.com</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                                Verified Partner
                            </span>
                        </div>
                        <div className="p-2">
                             <button onClick={handleRestrictedAction} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 text-sm transition-colors">
                                <User size={18} /> โปรไฟล์ร้านค้า
                            </button>
                            <button onClick={handleRestrictedAction} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 text-sm transition-colors">
                                <Mail size={18} /> กล่องข้อความ
                            </button>
                            
                            <button onClick={() => { setShowPolicy(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 text-sm transition-colors">
                                <FileText size={18} /> นโยบายส่วนแบ่งรายได้ (GP)
                            </button>

                            <button onClick={handleRestrictedAction} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 text-sm transition-colors">
                                <LogOut size={18} /> ออกจากระบบ
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-20">

            {/* DASHBOARD VIEW */}
            {currentView === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Time Filter Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">ภาพรวมรายรับ</h2>
                        <p className="text-sm text-grey">ข้อมูลสรุปผลการดำเนินงานของร้าน (แสดงข้อมูลตามช่วงเวลาที่เลือก)</p>
                    </div>
                    {/* Fixed alignment: ml-auto pushes it to right on mobile (flex-col items-start) */}
                    <div className="flex gap-2 items-center bg-white p-1 rounded-xl border border-gray-100 shadow-sm ml-auto sm:ml-0">
                        <select 
                            value={dashboardTimeRange}
                            onChange={(e) => setDashboardTimeRange(e.target.value as any)}
                            className="bg-transparent text-sm font-medium text-gray-700 px-3 py-2 rounded-lg focus:outline-none cursor-pointer hover:bg-gray-50"
                        >
                            <option value="today">วันนี้</option>
                            <option value="7d">7 วันล่าสุด</option>
                            <option value="30d">30 วันล่าสุด</option>
                            <option value="custom">กำหนดเอง</option>
                        </select>
                        {dashboardTimeRange === 'custom' && (
                            <div className="flex items-center gap-2 px-2 border-l border-gray-200">
                                <input 
                                    type="date" 
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="text-xs border rounded p-1"
                                />
                                <span className="text-xs">-</span>
                                <input 
                                    type="date" 
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="text-xs border rounded p-1"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Gross Sales */}
                  <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-[28px] shadow-daili shadow-blue-200 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mb-10 group-hover:scale-110 transition-transform"></div>
                     <button onClick={() => setShowPolicy(true)} className="absolute top-4 right-4 bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition-colors z-20">
                        <Info size={16} />
                     </button>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2 text-blue-100">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                          <DollarSign size={20} />
                        </div>
                        <span className="text-sm font-medium">ยอดขายรวม (Gross)</span>
                      </div>
                      <p className="text-4xl font-bold mt-2">฿{stats.grossSales.toLocaleString()}</p>
                      <p className="text-xs text-blue-100/70 mt-2">ในช่วงเวลาที่เลือก</p>
                    </div>
                  </div>

                  {/* Card 2: Job Count */}
                   <div className="bg-white p-6 rounded-[28px] shadow-daili border border-soft-blue relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2 text-grey">
                        <div className="p-2 bg-orange-100 text-accent rounded-xl">
                          <TrendingUp size={20} />
                        </div>
                        <span className="text-sm font-medium">จำนวนงาน</span>
                      </div>
                      <p className="text-4xl font-bold text-gray-800 mt-2">{stats.orderCount}</p>
                      <p className="text-xs text-gray-400 mt-2">ออเดอร์ในช่วงเวลานี้</p>
                    </div>
                  </div>

                  {/* Card 3: Active Jobs */}
                  <div className="bg-white p-6 rounded-[28px] shadow-daili border border-soft-blue relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2 text-grey">
                        <div className="p-2 bg-blue-100 text-primary rounded-xl">
                          <Package size={20} />
                        </div>
                        <span className="text-sm font-medium">กำลังดำเนินการ</span>
                      </div>
                      <p className="text-4xl font-bold text-primary mt-2">{stats.activeJobs}</p>
                      <p className="text-xs text-gray-400 mt-2">ที่อยู่ในช่วงเวลานี้</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Chart Section - Dynamic */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-[28px] shadow-daili border border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">
                          {dashboardTimeRange === 'today' ? 'ยอดขายรายชั่วโมง (วันนี้)' : 'แนวโน้มยอดขาย (ตามช่วงเวลา)'}
                      </h3>
                    </div>
                    <div className="h-[250px] w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fill: '#9ca3af'}} 
                            dy={10}
                          />
                          <YAxis 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{fontSize: 12, fill: '#9ca3af'}} 
                          />
                          <Tooltip 
                            cursor={{fill: '#ecf4fc', opacity: 0.5}}
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                          />
                          <Bar dataKey="sales" radius={[6, 6, 6, 6]}>
                            {salesChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === salesChartData.length - 1 ? '#f17300' : '#dbeafe'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Activity Mini List (Shows filtered list) */}
                  <div className="bg-white p-6 rounded-[28px] shadow-daili border border-gray-50 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-lg mb-4">ออเดอร์ในรายการ</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                      {filteredDashboardOrders.slice(0, 4).map(order => (
                        <div key={order.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-soft-blue/50 transition-colors border border-transparent hover:border-soft-blue group cursor-pointer">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 ${getStatusConfig(order.status).bg} ${getStatusConfig(order.status).text}`}>
                             {order.serviceType === 'standard' ? 'S' : 'B'}
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm font-semibold text-gray-700 truncate">{order.customerName}</p>
                             <p className="text-xs text-grey">฿{order.price.total}</p>
                           </div>
                           <div className={`w-2 h-2 rounded-full ${getStatusConfig(order.status).dot}`}></div>
                        </div>
                      ))}
                      {filteredDashboardOrders.length === 0 && (
                          <p className="text-center text-gray-400 text-sm py-4">ไม่มีข้อมูลในช่วงเวลานี้</p>
                      )}
                    </div>
                     <button onClick={() => setCurrentView('orders')} className="w-full mt-4 py-3 text-sm font-semibold text-primary bg-soft-blue rounded-xl hover:bg-blue-100 transition-colors">
                      ดูทั้งหมด
                    </button>
                  </div>
                </div>

                {/* NEW CHARTS ROW: Customer Base & Service Time (Reactive) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Customer Base (Pie/Donut Chart) - Updated Tooltip to show Count */}
                  <div className="bg-white p-6 rounded-[28px] shadow-daili border border-gray-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-primary rounded-xl">
                            <Users size={20} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">ฐานลูกค้า (ในช่วงเวลานี้)</h3>
                    </div>
                    <div className="h-[250px] w-full flex items-center justify-center relative">
                         {/* Center Text for Donut - Shows Count dynamically based on hover or total */}
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800">
                                {pieActiveIndex >= 0 && customerTypeData[pieActiveIndex] 
                                    ? customerTypeData[pieActiveIndex].count 
                                    : customerTypeData.reduce((acc, curr) => acc + (curr.count||0), 0)
                                }
                            </span>
                            <span className="text-xs text-gray-400">
                                {pieActiveIndex >= 0 && customerTypeData[pieActiveIndex] ? 'คน' : 'คน (รวม)'}
                            </span>
                         </div>
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    {...{ activeIndex: pieActiveIndex } as any}
                                    activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }: any) => (
                                        <g>
                                            <Sector
                                                cx={cx}
                                                cy={cy}
                                                innerRadius={innerRadius}
                                                outerRadius={outerRadius + 8}
                                                startAngle={startAngle}
                                                endAngle={endAngle}
                                                fill={fill}
                                            />
                                        </g>
                                    )}
                                    data={customerTypeData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={8}
                                    onMouseEnter={onPieEnter}
                                >
                                    {customerTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-center">
                                                    <p className="text-sm font-bold text-gray-800">{data.name}</p>
                                                    <p className="text-primary font-bold text-lg">{data.count} คน</p>
                                                    <p className="text-xs text-gray-400">({data.value}%)</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                         </ResponsiveContainer>
                    </div>
                    {/* Custom Legend */}
                    <div className="flex justify-center gap-6 mt-2">
                        {customerTypeData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100" onMouseEnter={() => setPieActiveIndex(index)}>
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                                <span className="text-sm text-gray-600 font-medium">{item.name} <span className="text-gray-400 ml-1">{item.value}%</span></span>
                            </div>
                        ))}
                    </div>
                  </div>

                  {/* Hourly Activity (Area Chart) - Updated Mock Generator fixes the data issue */}
                  <div className="bg-white p-6 rounded-[28px] shadow-daili border border-gray-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-50 text-accent rounded-xl">
                            <Clock size={20} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">ช่วงเวลาที่ลูกค้าใช้บริการ (Heatmap)</h3>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyActivityData}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0460b7" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#0460b7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="time" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9ca3af'}} 
                                    interval={3} // Show every 3rd hour to avoid clutter
                                />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                                    labelStyle={{color: '#9ca3af', marginBottom: '4px'}}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke="#0460b7" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorOrders)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center text-xs text-gray-400 mt-2">
                        ความหนาแน่นของออเดอร์ในแต่ละช่วงเวลา จากข้อมูลชุดที่เลือก
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ORDERS VIEW */}
            {currentView === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Status Filters - Updated for new Statuses */}
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
                    {(['all', 'order_received', 'pickup_in_progress', 'washing', 'drying', 'delivery_in_progress', 'delivered'] as const).map(filter => (
                      <button 
                        key={filter}
                        onClick={() => setOrderStatusFilter(filter)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all shadow-sm
                          ${orderStatusFilter === filter 
                            ? 'bg-primary text-white border-primary shadow-blue-200' 
                            : 'bg-white border-gray-200 text-grey hover:border-primary hover:text-primary'
                          }`}
                      >
                         {filter === 'all' ? 'ทั้งหมด' : getStatusConfig(filter).label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Filter */}
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                        <select 
                            value={orderSort}
                            onChange={(e) => setOrderSort(e.target.value as 'latest' | 'oldest')}
                            className="appearance-none bg-white border border-gray-200 text-sm text-grey rounded-full pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:border-primary transition-colors"
                        >
                            <option value="latest">ล่าสุด</option>
                            <option value="oldest">เก่าสุด</option>
                        </select>
                        <Filter size={14} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                        <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOrdersList.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onUpdateStatus={handleStatusUpdate} 
                    />
                  ))}
                  {filteredOrdersList.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-[28px] border border-dashed border-gray-200">
                      <Package size={48} className="mx-auto mb-4 opacity-30" />
                      <p>ไม่พบออเดอร์ที่ค้นหา</p>
                      <button 
                        onClick={() => setOrderStatusFilter('all')}
                        className="mt-4 text-primary text-sm hover:underline"
                      >
                          ล้างตัวกรอง
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

             {/* FINANCE VIEW */}
             {currentView === 'finance' && (
               <div className="bg-white rounded-[28px] shadow-daili overflow-hidden animate-fade-in">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">รายการเดินบัญชี</h3>
                        <p className="text-xs text-grey">ประวัติรายรับและรายการหักค่าบริการ</p>
                    </div>
                    <button 
                        onClick={() => setIsEBillOpen(true)}
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-soft-blue hover:text-primary hover:border-soft-blue transition-all flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} /> ออกใบวางบิล (E-Bill)
                    </button>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="bg-soft-blue/30 text-grey text-sm">
                       <tr>
                         <th className="p-5 font-medium whitespace-nowrap">วันที่ / เวลา</th>
                         <th className="p-5 font-medium whitespace-nowrap">ออเดอร์ ID</th>
                         <th className="p-5 font-medium whitespace-nowrap text-right">ยอดรวม (Gross)</th>
                         <th className="p-5 font-medium whitespace-nowrap text-right">GP (30%)</th>
                         <th className="p-5 font-medium whitespace-nowrap text-right">Tax (3%)</th>
                         <th className="p-5 font-medium whitespace-nowrap text-right text-primary">ยอดสุทธิ (Net)</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {filteredOrdersList.filter(o => o.status !== 'cancelled').map(order => {
                         const fin = calculateFinancials(order.price.total);
                         return (
                           <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                             <td className="p-5 text-sm text-gray-600">
                                 <div className="font-medium text-gray-800">{formatDateThai(order.createdAt).split(' ')[0]}</div>
                                 <div className="text-xs text-gray-400">{formatDateThai(order.createdAt).split(' ')[1]}</div>
                             </td>
                             <td className="p-5 text-sm font-medium text-primary group-hover:underline cursor-pointer">{order.id}</td>
                             <td className="p-5 text-sm text-right text-gray-600 font-medium">฿{fin.gross.toFixed(2)}</td>
                             <td className="p-5 text-sm text-right text-red-400">-฿{fin.gp.toFixed(2)}</td>
                             <td className="p-5 text-sm text-right text-red-400">-฿{fin.tax.toFixed(2)}</td>
                             <td className="p-5 text-sm text-right font-bold text-green-600 bg-green-50/50">+฿{fin.net.toFixed(2)}</td>
                           </tr>
                         )
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}

            {/* Modals */}
            <EBillModal 
                isOpen={isEBillOpen} 
                onClose={() => setIsEBillOpen(false)} 
                orders={orders.filter(o => o.status !== 'cancelled')} // Pass all active orders
                onShowComingSoon={() => setShowComingSoon(true)}
            />
            
            <ComingSoonModal 
                isOpen={showComingSoon} 
                onClose={() => setShowComingSoon(false)} 
            />

            <PolicyModal 
                isOpen={showPolicy}
                onClose={() => setShowPolicy(false)}
            />

            {/* Added Notification Modal at the bottom */}
            <NotificationModal 
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={MOCK_NOTIFICATIONS}
                onReadAll={handleReadAllNotifs}
                hasUnread={hasUnreadNotifs}
            />

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;