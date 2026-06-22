import { useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, differenceInCalendarDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import { TrendingUp, BedDouble, Calendar, DollarSign } from 'lucide-react';
import { useHotelStore } from '../store';
import { STATUS_COLORS, STATUS_LABELS, SOURCE_LABELS } from '../utils';

export function StatsPanel() {
  const { rooms, bookings } = useHotelStore();

  const stats = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = differenceInCalendarDays(monthEnd, monthStart) + 1;
    const activeRooms = rooms.filter((r) => r.active && r.category !== 'restaurant');

    const monthBookings = bookings.filter((b) => {
      const ci = parseISO(b.checkIn);
      const co = parseISO(b.checkOut);
      return b.status !== 'cancelled' && ci <= monthEnd && co >= monthStart;
    });

    const revenue = monthBookings.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);
    const paid = monthBookings.reduce((sum, b) => sum + (b.paidAmount ?? 0), 0);

    // Occupancy
    let occupiedNights = 0;
    monthBookings.forEach((b) => {
      const ci = parseISO(b.checkIn);
      const co = parseISO(b.checkOut);
      const start = ci < monthStart ? monthStart : ci;
      const end = co > monthEnd ? monthEnd : co;
      const nights = differenceInCalendarDays(end, start);
      if (nights > 0) occupiedNights += nights;
    });
    const totalRoomNights = activeRooms.length * daysInMonth;
    const occupancy = totalRoomNights > 0 ? (occupiedNights / totalRoomNights) * 100 : 0;

    // Today's check-ins/outs
    const todayStr = format(today, 'yyyy-MM-dd');
    const checkIns = bookings.filter((b) => b.checkIn === todayStr && b.status !== 'cancelled').length;
    const checkOuts = bookings.filter((b) => b.checkOut === todayStr && b.status !== 'cancelled').length;

    // By status
    const byStatus: Record<string, number> = {};
    bookings.forEach((b) => {
      if (!byStatus[b.status]) byStatus[b.status] = 0;
      byStatus[b.status]++;
    });

    // By source
    const bySource: Record<string, number> = {};
    bookings.forEach((b) => {
      if (!bySource[b.source]) bySource[b.source] = 0;
      bySource[b.source]++;
    });

    // Upcoming (next 7 days)
    const upcoming = bookings
      .filter((b) => {
        const ci = parseISO(b.checkIn);
        const diff = differenceInCalendarDays(ci, today);
        return diff >= 0 && diff <= 7 && b.status !== 'cancelled';
      })
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

    return { revenue, paid, occupancy, checkIns, checkOuts, byStatus, bySource, upcoming, monthBookings, daysInMonth };
  }, [rooms, bookings]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Статистика</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={<TrendingUp size={20} className="text-blue-600" />}
          label="Заповненість (міс.)"
          value={`${stats.occupancy.toFixed(1)}%`}
          bg="bg-blue-50"
        />
        <KPICard
          icon={<DollarSign size={20} className="text-green-600" />}
          label="Дохід (міс.)"
          value={`₴${stats.revenue.toLocaleString()}`}
          bg="bg-green-50"
        />
        <KPICard
          icon={<Calendar size={20} className="text-amber-600" />}
          label="Заїздів сьогодні"
          value={String(stats.checkIns)}
          bg="bg-amber-50"
        />
        <KPICard
          icon={<BedDouble size={20} className="text-purple-600" />}
          label="Виїздів сьогодні"
          value={String(stats.checkOuts)}
          bg="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Бронювання за статусом</h3>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).map(([status, count]) => {
              const total = bookings.length || 1;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[status] ?? '#94a3b8' }}
                  />
                  <span className="text-sm text-slate-600 flex-1">{STATUS_LABELS[status] ?? status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / total) * 100}%`,
                          background: STATUS_COLORS[status] ?? '#94a3b8',
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-6 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By source */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Бронювання за джерелом</h3>
          <div className="space-y-3">
            {Object.entries(stats.bySource).map(([source, count]) => {
              const total = bookings.length || 1;
              return (
                <div key={source} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 flex-1">{SOURCE_LABELS[source] ?? source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-6 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming arrivals */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-700 mb-4">Найближчі заїзди (7 днів)</h3>
        {stats.upcoming.length === 0 ? (
          <p className="text-slate-400 text-sm">Немає майбутніх заїздів</p>
        ) : (
          <div className="space-y-2">
            {stats.upcoming.map((b) => {
              const room = rooms.find((r) => r.id === b.roomId);
              return (
                <div key={b.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div
                    className="w-2 h-10 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[b.status] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-800">{b.guestName}</div>
                    <div className="text-xs text-slate-500">
                      {room?.number} – {room?.name} · {b.adults}+{b.children} ос.
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-slate-700">
                      {format(parseISO(b.checkIn), 'd MMM', { locale: uk })}
                    </div>
                    <div className="text-xs text-slate-400">
                      ₴{b.totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 border border-slate-100`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
