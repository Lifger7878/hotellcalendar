---
description: "Use when: building a new React component for the hotel calendar app, scaffolding a panel, modal, card or section with TypeScript and Tailwind"
mode: ask
---
# Новий React компонент

Опишіть компонент, який потрібно створити:

**Назва компонента:** ${{ input: "Назва (PascalCase), напр. GuestHistoryPanel" }}

**Призначення:** ${{ input: "Що компонент робить?" }}

**Тип:** ${{ input: "modal | panel | card | table | form | other" }}

**Приймає пропси?** ${{ input: "Так/Ні — якщо так, опишіть" }}

**Читає з useHotelStore?** ${{ input: "Які поля потрібні зі store?" }}

---
Create a new React component file at `src/components/{{ component_name }}.tsx`.

Requirements:
- Named export: `export function {{ component_name }}()`
- TypeScript strict typing for all props
- Tailwind CSS v4 utility classes only — NO inline style objects except for dynamic colors/positions
- All user-visible text in Ukrainian (uk-UA)
- lucide-react for any icons
- Mobile-responsive with Tailwind breakpoint prefixes
- Hover/focus states on all interactive elements
- Import data from `useHotelStore` directly if needed — no prop drilling for store data
- Follow existing card style: `bg-white rounded-xl border border-slate-200 shadow-sm p-4`
- Follow existing modal style: `bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`

After creating the file, verify with: `npm run build`
