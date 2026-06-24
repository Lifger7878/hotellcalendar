import { useState } from 'react';
import { useHotelStore } from '../store';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../utils';
import { Plus, Edit2, Trash2, CheckSquare, Square, X } from 'lucide-react';
import type { Room } from '../types';

export function RoomsPanel() {
  const { rooms, bookings, openNewRoom, openEditRoom, deleteRoom } = useHotelStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

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

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = rooms.length > 0 && selected.size === rooms.length;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rooms.map((r) => r.id)));
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Видалити ${selected.size} номерів? Усі бронювання в цих номерах також будуть видалені.`)) return;
    setDeleting(true);
    for (const id of selected) {
      await deleteRoom(id);
    }
    setSelected(new Set());
    setDeleting(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-slate-800">Номери та зали</h2>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <>
              <span className="text-sm text-slate-500">{selected.size} обрано</span>
              <button onClick={() => setSelected(new Set())} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={15} />
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
              >
                <Trash2 size={14} />
                {deleting ? 'Видалення...' : `Видалити (${selected.size})`}
              </button>
            </>
          )}
          {rooms.length > 0 && (
            <button onClick={toggleAll} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm transition-colors">
              {allSelected ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
              {allSelected ? 'Зняти все' : 'Вибрати все'}
            </button>
          )}
          <button
            onClick={openNewRoom}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Додати
          </button>
        </div>
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
              const isSelected = selected.has(room.id);
              return (
                <div
                  key={room.id}
                  className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-2 transition-colors ${
                    isSelected ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-200'
                  } ${!room.active ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleOne(room.id)}
                        className="text-slate-400 hover:text-blue-600 flex-shrink-0 mt-0.5 transition-colors"
                      >
                        {isSelected ? <CheckSquare size={17} className="text-blue-600" /> : <Square size={17} />}
                      </button>
                      <span className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: room.color }} />
                      <div>
                        <div className="font-bold text-slate-800 text-base">{room.number}</div>
                        <div className="text-xs text-slate-500">{room.name}</div>
                      </div>
                    </div>
                    <button onClick={() => openEditRoom(room)} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
                      <Edit2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>👥 {room.capacity} ос.</span>
                    {room.pricePerNight > 0 && <span>₴{room.pricePerNight.toLocaleString()}/ніч</span>}
                    {room.floor !== undefined && <span>Пов. {room.floor}</span>}
                  </div>

                  {booking ? (
                    <div className="rounded-lg px-3 py-2 text-xs font-semibold text-white" style={{ background: STATUS_COLORS[booking.status] }}>
                      {STATUS_LABELS[booking.status]}: {booking.guestName}
                    </div>
                  ) : room.active ? (
                    <div className="rounded-lg px-3 py-2 text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Вільний</div>
                  ) : (
                    <div className="rounded-lg px-3 py-2 text-xs font-semibold bg-slate-100 text-slate-500">Не активний</div>
                  )}

                  {room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                      {room.amenities.length > 4 && <span className="text-slate-400 text-xs">+{room.amenities.length - 4}</span>}
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
