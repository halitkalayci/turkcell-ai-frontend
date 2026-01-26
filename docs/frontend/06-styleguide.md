# STYLEGUIDE.MD
## Frontend UI & Styling Rules (Tailwind CSS)

This document defines **mandatory UI, styling, and design rules** for frontend.

All UI code (human or AI-Generated) **must comply** with these rules.

**Tailwind CSS is mandatory.**
No custom CSS files, inline styles or alternative styling systems are allowed unless explicitly asked.

---

## 1) DESIGN PHILOSOPHY

- Clean, minimal and predictable UI

- Content-first not decoration-first

- Accessibility-aware by default

> If a design decision conflicts with usability or clarity, choose usability.

---

## 2) COLOR SYSTEM (Strict)

### 2.1 Allowed Color Sources

- Tailwind default color palette
- Project-defined semantic colors only

❌ Hardcoded hex/rgb values are **forbidden**
❌ Random Tailwind colors without semantic are **forbidden**

### 2.2 Semantic Color Usage

Use colors by **intent**, not by appearance.

| Intent | Tailwind Color |
| ------ | -------------- |
| Primary Action | `bg-blue-600 text-white` |
| Secondary Action | `bg-gray-100 text-gray-900` |
| Success | `text-green-600 bg-green-50` |
| Warning | `text-yellow-700 bg-yellow-50` |
| Error | `text-red-600 bg-red-50` |
| Disabled | `opacity-50 cursor-not-allowed` |

> Do NOT introduce new color meanings without approval and documentation.

## 3) Typography

### 3.1) Font Rules

- Use Tailwind default font stack
- No custom fonts

### 3.2) Font Hierarchy

| Usage | Tailwind Class |
| ----- | -------------- |
| Page Title | `text-2xl font-semibold` |
| Section Title | `text-xl font-semibold` |
| Card Title | `text-lg font-medium` |
| Body Text | `text-sm` |
| Helper & Error Texts | `text-xs`|

> Do NOT INVENT new font sizes or font families without approval.



