import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useHotelStore } from '../store';
import { STATUS_LABELS, STATUS_COLORS } from '../utils';
import type { FilterStatus } from '../types';

const DAYS_OPTIONS = [14, 30, 60, 90];
const STATUS_FILTER_OPTIONS: FilterStatus[] = ['all', 'confirmed', 'pending', 'checkin', 'checkout', 'cancelled'];

interface HeaderProps {
  activeTab: string;
}

const TAB_TITLES: Record<string, string> = {
  calendar: 'Календар бронювань',
  rooms: 'Номери та зали',
  stats: 'Статистика',
  settings: 'Налаштування',
};

export function Header({ activeTab }: HeaderProps) {
  const {
    calendarView,
    navigateMonth,
    setCalendarView,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
  } = useHotelStore();

  const [showFilters, setShowFilters] = useState(false);
  const startDate = parseISO(calendarView.startDate);
  const monthLabel = format(startDate, 'LLLL yyyy', { locale: uk });

  return (
    <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex-shrink-0">
      {/* Top row */}
      <div className="flex items-center gap-3 min-h-[36px]">
        {/* Mobile spacer (for hamburger) */}
        <div className="w-10 lg:hidden flex-shrink-0" />

        {/* Title */}
        <h1 className="text-base sm:text-lg font-bold text-slate-800 capitalize flex-shrink-0">
          {TAB_TITLES[activeTab] ?? activeTab}
        </h1>

        <div className="flex-1" />

        {/* Calendar-only controls */}
        {activeTab === 'calendar' && (
          <>
            {/* Month nav */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-xl px-1 py-1">
              <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-slate-700 capitalize px-2 min-w-[130px] text-center">
                {monthLabel}
              </span>
              <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Days selector */}
            <div className="hidden md:flex gap-1 bg-slate-100 rounded-xl p-1">
              {DAYS_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setCalendarView({ days: d })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${calendarView.days === d ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {d}д
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Пошук гостя..."
                className="w-32 sm:w-44 pl-8 pr-7 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all focus:w-48 sm:focus:w-56"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border transition-colors ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </>
        )}
      </div>

      {/* Calendar secondary row (mobile month nav + filters) */}
      {activeTab === 'calendar' && (
        <>
          {/* Mobile month row */}
          <div className="sm:hidden flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-1 py-1">
              <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                <ChevronLeft size={15} />
              </button>
              <span className="text-sm font-semibold text-slate-700 capitalize px-1">
                {monthLabel}
              </span>
              <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-lg hover:bg-white text-slate-600">
                <ChevronRight size={15} />
              </button>
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {DAYS_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setCalendarView({ days: d })}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${calendarView.days === d ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Filter bar */}
          {showFilters && (
            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-100">
              {STATUS_FILTER_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    filterStatus === s ? 'text-white border-transparent' : 'text-slate-500 border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  style={filterStatus === s ? { background: s === 'all' ? '#475569' : STATUS_COLORS[s] } : {}}
                >
                  {s === 'all' ? 'Всі статуси' : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
