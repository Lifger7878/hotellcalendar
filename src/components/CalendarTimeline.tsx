import React, { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { format } from 'date-fns';
import { useHotelStore } from '../store';
import {
  getDaysArray,
  isWeekend,
  isToday,
  getBookingPosition,
  STATUS_COLORS,
  CATEGORY_LABELS,
} from '../utils';
import type { Booking, Room } from '../types';

const CELL_WIDTH = 44;
const ROW_HEIGHT = 52;
const LABEL_WIDTH = 200;

interface BookingBarProps {
  booking: Booking;
  left: number;
  width: number;
  onClickBooking: (b: Booking) => void;
}

function BookingBar({ booking, left, width, onClickBooking }: BookingBarProps) {
  const color = booking.color ?? STATUS_COLORS[booking.status] ?? '#3b82f6';
  const textColor = '#fff';

  return (
    <div
      className="booking-bar"
      style={{
        left,
        width,
        background: color,
        color: textColor,
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClickBooking(booking);
      }}
      title={`${booking.guestName} · ${booking.checkIn} – ${booking.checkOut}`}
    >
      <div className="booking-label">{booking.guestName}</div>
    </div>
  );
}

export function CalendarTimeline() {
  const {
    rooms,
    bookings,
    calendarView,
    openNewBooking,
    openEditBooking,
    filterStatus,
    searchQuery,
  } = useHotelStore();

  const startDate = parseISO(calendarView.startDate);
  const days = getDaysArray(startDate, calendarView.days);

  const activeRooms = useMemo(
    () => rooms.filter((r) => r.active),
    [rooms]
  );

  const filteredBookings = useMemo(() => {
    let list = bookings;
    if (filterStatus !== 'all') list = list.filter((b) => b.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.guestName.toLowerCase().includes(q) ||
          b.notes.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, filterStatus, searchQuery]);

  const totalWidth = CELL_WIDTH * calendarView.days;

  const handleCellClick = (roomId: string, date: Date) => {
    openNewBooking(roomId, format(date, 'yyyy-MM-dd'));
  };

  const groupedRooms = useMemo(() => {
    const groups: Record<string, Room[]> = {};
    activeRooms.forEach((r) => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [activeRooms]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Single scroll container — both dates and rows scroll together */}
      <div className="flex-1 overflow-auto">
        {/* Min-width keeps the grid from collapsing when content is narrow */}
        <div style={{ minWidth: LABEL_WIDTH + totalWidth }}>

          {/* Sticky header row */}
          <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
            {/* Room label header — sticky left + top */}
            <div
              className="flex-shrink-0 bg-slate-50 border-r border-slate-200 flex items-center px-4 font-semibold text-slate-600 text-sm sticky left-0 z-30"
              style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
            >
              Номер / Зал
            </div>
            {/* Dates */}
            <div className="flex" style={{ width: totalWidth }}>
              {days.map((day, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-200 py-1 text-xs font-medium select-none ${
                    isToday(day)
                      ? 'bg-blue-600 text-white'
                      : isWeekend(day)
                      ? 'bg-slate-100 text-slate-500'
                      : 'text-slate-600'
                  }`}
                  style={{ width: CELL_WIDTH }}
                >
                  <span className="leading-tight">{format(day, 'd')}</span>
                  <span className="leading-tight opacity-70 capitalize">
                    {format(day, 'EEE', { locale: uk }).slice(0, 2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Room rows */}
          {Object.entries(groupedRooms).map(([category, catRooms]) => (
            <React.Fragment key={category}>
              {/* Category separator */}
              <div
                className="flex items-center bg-slate-100 border-b border-slate-200"
                style={{ height: 28 }}
              >
                <div
                  className="flex-shrink-0 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 sticky left-0 bg-slate-100 z-10"
                  style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
                >
                  {CATEGORY_LABELS[category] ?? category}
                </div>
                <div style={{ width: totalWidth }} />
              </div>

              {catRooms.map((room) => {
                const roomBookings = filteredBookings.filter(
                  (b) => b.roomId === room.id && b.status !== 'cancelled'
                );

                return (
                  <div
                    key={room.id}
                    className="flex border-b border-slate-100 hover:bg-slate-50/50"
                    style={{ height: ROW_HEIGHT }}
                  >
                    {/* Room label — sticky left */}
                    <div
                      className="flex-shrink-0 border-r border-slate-200 flex items-center px-3 gap-2 cursor-default sticky left-0 bg-white z-10"
                      style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: room.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-800 truncate">
                          {room.number} – {room.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {room.capacity} ос.{room.pricePerNight > 0 ? ` · ₴${room.pricePerNight.toLocaleString()}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Timeline cells */}
                    <div className="relative flex-shrink-0" style={{ width: totalWidth }}>
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        {days.map((day, i) => (
                          <div
                            key={i}
                            className={`flex-shrink-0 h-full border-r ${
                              isToday(day)
                                ? 'bg-blue-50/60 border-blue-300'
                                : isWeekend(day)
                                ? 'bg-slate-50/80 border-slate-200'
                                : 'border-slate-100'
                            }`}
                            style={{ width: CELL_WIDTH }}
                          />
                        ))}
                      </div>

                      {/* Clickable day cells */}
                      <div className="absolute inset-0 flex">
                        {days.map((day, i) => (
                          <div
                            key={i}
                            className="flex-shrink-0 h-full cursor-pointer hover:bg-blue-100/40 transition-colors"
                            style={{ width: CELL_WIDTH }}
                            onClick={() => handleCellClick(room.id, day)}
                          />
                        ))}
                      </div>

                      {/* Booking bars */}
                      {roomBookings.map((booking) => {
                        const { left, width, visible } = getBookingPosition(
                          booking,
                          startDate,
                          calendarView.days,
                          CELL_WIDTH
                        );
                        if (!visible) return null;
                        return (
                          <BookingBar
                            key={booking.id}
                            booking={booking}
                            left={left}
                            width={width}
                            onClickBooking={openEditBooking}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          {activeRooms.length === 0 && (
            <div className="flex items-center justify-center h-48 text-slate-400">
              Немає активних номерів. Додайте номер у розділі «Номери».
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
