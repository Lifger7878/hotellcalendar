---
applyTo: "src/store.ts"
---
# Zustand Store Rules

- Single store: `useHotelStore` — never split into multiple stores
- Persist key must stay `'hotel-calendar-storage'` — changing it clears all user data
- All actions use `set((s) => ...)` — never mutate state directly
- New entity IDs via the `uid()` helper at top of file
- Dates always as `YYYY-MM-DD` strings — use `format(date, 'yyyy-MM-dd')` and `parseISO(str)`
