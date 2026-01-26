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

## 4) Reference-Based UI (Mandatory)

All components **MUST strictly follow given reference** if any.

### 4.1) Governance Rules

When a reference image is provided for a component:

**MANDATORY Requirements:**
1. **Visual Structure**: Layout, element positioning, and visual hierarchy MUST match the reference exactly
2. **Element Presence**: All visible elements in reference (badges, buttons, icons) MUST be implemented
3. **Spacing & Sizing**: Padding, margins, and proportions MUST follow the reference closely
4. **Typography**: Font sizes, weights, and hierarchy MUST match (use closest Tailwind class from section 3.2)
5. **Color Semantics**: Use semantic colors from section 2.2 that best match the reference intent

**Missing Data Handling:**
- If backend lacks fields shown in reference (e.g., discount, rating), implement UI structure with:
  - Mock/placeholder data for development, OR
  - Conditional rendering (hide element if data unavailable)
- NEVER skip UI elements just because data is missing
- Document missing fields for future backend implementation

**Deviation Policy:**
- ❌ FORBIDDEN: Ignoring reference layout or removing reference elements
- ✅ ALLOWED: Minor adjustments for accessibility or technical constraints
- ⚠️ REQUIRES APPROVAL: Major deviations from reference design

### 4.2) Component Reference Table

| Component Name | Reference Path | Status |
| -------------- | -------------- | ------ |
| Product Card   | `docs/frontend/references/product_card_reference.png` | Active |
