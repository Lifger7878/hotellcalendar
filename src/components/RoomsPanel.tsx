import { useHotelStore } from '../store';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../utils';
import { Plus, Edit2 } from 'lucide-react';
import type { Room } from '../types';

export function RoomsPanel() {
  const { rooms, bookings, openNewRoom, openEditRoom } = useHotelStore();

  const getActiveBookings = (roomId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter(
      (b) =>
        b.roomId === roomId &&
        b.checkIn <= today &&
        b.checkOut > today &&
        b.status !== 'cancelled'
    );
  };

  const grouped = rooms.reduce<Record<string, Room[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Номери та зали</h2>
        <button
          onClick={openNewRoom}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Додати
        </button>
      </div>

      {Object.entries(grouped).map(([cat, catRooms]) => (
        <div key={cat}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {CATEGORY_LABELS[cat] ?? cat}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {catRooms.map((room) => {
              const active = getActiveBookings(room.id);
              const booking = active[0];
              return (
                <div
                  key={room.id}
                  className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2 ${!room.active ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ background: room.color }}
                      />
                      <div>
                        <div className="font-bold text-slate-800 text-base">{room.number}</div>
                        <div className="text-xs text-slate-500">{room.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => openEditRoom(room)}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>👥 {room.capacity} ос.</span>
                    {room.pricePerNight > 0 && <span>₴{room.pricePerNight.toLocaleString()}/ніч</span>}
                    {room.floor !== undefined && <span>Пов. {room.floor}</span>}
                  </div>

                  {/* Current booking indicator */}
                  {booking ? (
                    <div
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-white"
                      style={{ background: STATUS_COLORS[booking.status] }}
                    >
                      {STATUS_LABELS[booking.status]}: {booking.guestName}
                    </div>
                  ) : room.active ? (
                    <div className="rounded-lg px-3 py-2 text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                      Вільний
                    </div>
                  ) : (
                    <div className="rounded-lg px-3 py-2 text-xs font-semibold bg-slate-100 text-slate-500">
                      Не активний
                    </div>
                  )}

                  {/* Amenities */}
                  {room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-slate-400 text-xs">+{room.amenities.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {rooms.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          Немає номерів. Натисніть «Додати» щоб створити перший.
        </div>
      )}
    </div>
  );
}
