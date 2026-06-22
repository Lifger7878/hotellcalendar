# Hotel Calendar — Project Guidelines

## Stack
- **React 19** + **TypeScript** (strict mode)
- **Vite** as build tool
- **Tailwind CSS v4** (`@import "tailwindcss"` — NO `tailwind.config.js`)
- **Zustand** with `persist` middleware for all global state
- **date-fns** (v4) `+ date-fns/locale/uk` for all date formatting
- **lucide-react** for icons only — no other icon libraries

## Project Structure

```
src/
  types.ts          — all TypeScript interfaces (Room, Booking, Guest, …)
  store.ts          — single Zustand store (useHotelStore)
  utils.ts          — pure date/color helper functions
  demoData.ts       — seed data generator
  index.css         — global styles + @import "tailwindcss"
  components/       — all React components (one per file, named exports)
```

## Code Conventions
- **Named exports** for all components (never default component exports except `App.tsx`)
- **No prop drilling** — read from `useHotelStore` directly inside components
- Types live in `src/types.ts`; never define ad-hoc interfaces in component files
- State mutations only via store actions — never mutate state objects directly
- All dates stored as `YYYY-MM-DD` ISO strings; use `parseISO` before any calculation
- Currency: Ukrainian hryvnia `₴`, format with `.toLocaleString()`
- UI language: **Ukrainian** for all labels, placeholders, and messages
- `window.confirm` is acceptable for destructive action confirmation (no extra modal needed)

## Build & Dev
```
npm run dev    — start dev server (http://localhost:5173)
npm run build  — TypeScript check + Vite production build
```

## Styling Rules
- Use **Tailwind utility classes** as primary styling method
- Custom CSS only in `index.css` for animation/transition classes that can't be done with utilities
- Color palette: `slate-*` for neutral UI, `blue-600` primary, `amber-500` accent
- Border radius convention: `rounded-lg` (cards), `rounded-xl` (panels), `rounded-2xl` (modals)

## Tailwind v4 Gotchas
- No `tailwind.config.js` — theme customization via CSS `@theme {}` blocks in `index.css`
- The Vite plugin `@tailwindcss/vite` handles everything; do NOT add `postcss.config.js`
- Use `bg-[#hex]` arbitrary values when a specific brand color is needed
