---
applyTo: "src/components/**/*.tsx"
---
# React Component Rules

- Named export only: `export function ComponentName()`
- All user-visible text in Ukrainian
- Tailwind CSS v4 utility classes — no inline `style` objects except dynamic color/position values from JS
- Icons from `lucide-react` only
- Do NOT import from `../store` if data can be passed as props; if reading global state, `useHotelStore` is fine
- Always add `transition-colors` to buttons
- Interactive elements need `cursor-pointer` and hover state
