import { useState } from 'react';
import {
  BedDouble, Calendar, BarChart3, Settings, LogOut,
  Menu, X, ChevronRight, PlusCircle
} from 'lucide-react';
import { useHotelStore } from '../store';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'calendar', label: 'Календар', icon: Calendar, description: 'Таймлайн бронювань' },
  { id: 'rooms', label: 'Номери', icon: BedDouble, description: 'Управління номерами' },
  { id: 'stats', label: 'Статистика', icon: BarChart3, description: 'Аналітика та звіти' },
  { id: 'settings', label: 'Налаштування', icon: Settings, description: 'Профіль готелю' },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, signOut, hotelProfile, openNewBooking, bookings, rooms } = useHotelStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Today's activity
  const today = new Date().toISOString().slice(0, 10);
  const checkInsToday = bookings.filter(b => b.checkIn === today && b.status !== 'cancelled').length;
  const checkOutsToday = bookings.filter(b => b.checkOut === today && b.status !== 'cancelled').length;
  const occupied = bookings.filter(b => b.checkIn <= today && b.checkOut > today && b.status !== 'cancelled').length;
  const totalRooms = rooms.filter(r => r.active && r.category !== 'restaurant').length;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + collapse */}
      <div className={`flex items-center justify-between px-4 py-5 border-b border-white/10 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <BedDouble size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white text-base truncate">
                {hotelProfile?.hotelName ?? 'HotelCalendar'}
              </div>
              <div className="text-blue-300 text-xs truncate">Управління готелем</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mx-auto">
            <BedDouble size={20} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-white/60 hover:text-white transition-colors ml-2 flex-shrink-0"
        >
          <ChevronRight size={18} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Quick stats */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/10">
          <div className="grid grid-cols-3 gap-2">
            <StatBubble label="Зайнято" value={`${occupied}/${totalRooms}`} color="bg-white/15" />
            <StatBubble label="Заїзди" value={String(checkInsToday)} color="bg-green-500/30" />
            <StatBubble label="Виїзди" value={String(checkOutsToday)} color="bg-amber-500/30" />
          </div>
        </div>
      )}

      {/* New booking button */}
      <div className={`px-3 py-3 border-b border-white/10 ${collapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => { openNewBooking(); setMobileOpen(false); }}
          className={`w-full bg-white/20 hover:bg-white/30 text-white rounded-xl py-2.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${collapsed ? 'px-0' : 'px-3'}`}
        >
          <PlusCircle size={16} />
          {!collapsed && 'Нове бронювання'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon, description }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { onTabChange(id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-white/25 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <div className="text-left min-w-0">
                  <div className="leading-tight">{label}</div>
                  <div className={`text-xs leading-tight ${isActive ? 'text-blue-200' : 'text-white/40 group-hover:text-white/60'}`}>
                    {description}
                  </div>
                </div>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className={`p-3 border-t border-white/10 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-white/10 mb-2">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{(user.name ?? user.email).charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-white text-xs font-semibold truncate">{user.name ?? 'Користувач'}</div>
              <div className="text-blue-300 text-xs truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors ${collapsed ? 'justify-center px-2' : ''}`}
          title="Вийти"
        >
          <LogOut size={16} />
          {!collapsed && 'Вийти'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full z-50 w-72 bg-gradient-to-b from-blue-700 to-blue-900 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={22} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col flex-shrink-0 bg-gradient-to-b from-blue-700 to-blue-900 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent />
      </div>
    </>
  );
}

function StatBubble({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`${color} rounded-xl px-2 py-2 text-center`}>
      <div className="text-white font-bold text-base leading-tight">{value}</div>
      <div className="text-blue-200 text-xs leading-tight">{label}</div>
    </div>
  );
}
