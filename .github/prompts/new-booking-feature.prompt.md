---
description: "Use when: adding a new hotel booking feature, implementing new booking workflow, adding a new field to bookings or rooms model, automating booking tasks"
mode: ask
---
# Нова фіча бронювання

Опишіть фічу:

**Назва фічі:** ${{ input: "Коротка назва, напр. Повторюване бронювання" }}

**Що потрібно зробити:** ${{ input: "Детальний опис поведінки та UI" }}

**Зачіпає типи/store?** ${{ input: "Так/Ні — які нові поля або дії потрібні?" }}

**Зачіпає UI компоненти?** ${{ input: "Які компоненти треба змінити або створити?" }}

---
Implement the described hotel booking feature following this workflow:

## Step 1 — Аналіз
Read the relevant files to understand the current implementation:
- `src/types.ts` — current data model
- `src/store.ts` — current state and actions
- `src/utils.ts` — existing helpers
- Relevant component files in `src/components/`

## Step 2 — Planning
Create a todo list with specific sub-tasks before writing any code.

## Step 3 — Types first
If new fields or interfaces are needed, update `src/types.ts` first.

## Step 4 — Store actions
Add new actions/state to `src/store.ts`. Follow immutability rules — use `set((s) => ...)`.

## Step 5 — Utils
Add pure helper functions to `src/utils.ts` as needed.

## Step 6 — Components
Create or update React components. Follow conventions:
- Named exports
- Ukrainian UI text
- Tailwind CSS v4 classes
- No prop drilling — use `useHotelStore`

## Step 7 — Verify
Run `npm run build` and fix any TypeScript errors before finishing.

## Constraints
- Do NOT break existing booking data in localStorage
- All new UI text must be in Ukrainian
- Use existing `STATUS_COLORS`, `STATUS_LABELS` from `src/utils.ts`
- Price always in ₴ (hryvnia) formatted with `.toLocaleString()`
