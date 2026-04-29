# AGENTS.md — METARUSH Project Rules
# Global AI Agent Constitution — All tools (Antigravity, Claude, Cursor) must follow these rules.
# v1.0 | April 2025

## PROJECT IDENTITY
- **Name:** METARUSH
- **Type:** Web3 Competition & Loot Box Platform (Premium Frontend Demo)
- **Stack:** Vanilla HTML + CSS + JavaScript (NO frameworks unless explicitly requested)
- **Design Philosophy:** Dark, premium, glassmorphism, neon accents, physics-based animations

---

## MANDATORY DESIGN RULES (NEVER VIOLATE)

### Typography
- Display font: **Orbitron** (headings, stats, labels)
- Body font: **Inter** (all body text, UI copy)
- Base font size: **15px**, line-height: **1.6**
- NEVER use system fonts unless as fallback
- NEVER invent font combinations not in the design system

### Color System
- Background primary: `#06060e`
- Background secondary: `#0b0b1e`
- Accent purple: `#7c3aed`
- Accent cyan: `#06b6d4`
- Accent green: `#10b981`
- Accent gold: `#f59e0b`
- NEVER use raw `red`, `blue`, `green` — always use design token variables
- ALL colors must be defined as CSS custom properties in `:root`

### Layout & Spacing
- Max content width: **1280px**
- Use CSS Grid and Flexbox — NEVER use absolute positioning for layout
- Spacing scale: `--space-xs` through `--space-4xl` (defined tokens)
- NEVER hardcode pixel values for spacing — always use tokens
- Mobile-first breakpoints: 480px, 768px, 1024px
- ZERO horizontal scroll bars allowed

### Animation Rules
- Animation duration: **150–400ms** (micro-interactions: 150ms, reveals: 400ms)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for primary animations
- EVERY animation must have a purpose (no decorative animation for its own sake)
- Use `prefers-reduced-motion` media query for accessibility
- Canvas particles: requestAnimationFrame only — NEVER setInterval for animations
- Hover transitions: 150–300ms max

### Components & Icons
- NEVER use emoji as icons in UI components (hover states, buttons, nav)
- Emoji ONLY in data labels (prize values, tier names) for thematic reasons
- Icons in nav/buttons/badges: Unicode symbols or inline SVG
- Buttons MUST be minimum 44×44px touch target
- All interactive elements need `cursor: pointer`

### Code Quality
- Comment every major CSS section
- JavaScript: ES6+ class-based architecture
- NEVER use `var` — use `const` and `let`
- NEVER use `!important` in CSS unless overriding third-party styles
- Event listeners: always use `addEventListener`, never inline `onclick` in new code

---

## NEGATIVE PROMPTING — FORBIDDEN PATTERNS

❌ `background-color: blue` or any raw color name  
❌ `font-family: Arial, sans-serif` as primary font  
❌ `position: absolute` for layout (only for overlays/tooltips)  
❌ `width: 100px` hardcoded widths (use %, max-width, grid)  
❌ Inline styles in HTML (exception: JS-injected dynamic values)  
❌ Bootstrap, jQuery, or external UI framework CSS unless user requests  
❌ `box-shadow: 0 0 5px #000` generic shadows — use design token shadows  
❌ Any Lorem Ipsum placeholder text  
❌ `setTimeout` for CSS animation orchestration — use `animation-delay`  
❌ `!important` in new CSS rules  

---

## FILE STRUCTURE (DO NOT RESTRUCTURE WITHOUT APPROVAL)

```
BetWebsite/
├── index.html              ← Single HTML file, all sections
├── css/
│   └── style.css           ← All styles, 900+ lines, DO NOT SPLIT
├── js/
│   ├── particles.js        ← Canvas particle system (class-based)
│   ├── wallet.js           ← WalletManager class
│   ├── competitions.js     ← CompetitionManager class
│   ├── lootbox.js          ← LootBoxManager class
│   └── app.js              ← MetaRushApp class (main controller)
├── .agent/
│   └── rules/
│       └── design-system-strictness.md
└── AGENTS.md               ← This file
```

---

## SKILL INVOCATION GUIDE

When asked to improve UI/UX quality, invoke:
- `@frontend-design` — General UI quality improvements
- `@ui-ux-pro-max` — BM25 design intelligence database
- `@3d-web-experience` — Three.js / WebGL integration guidance
- `@landing-page-generator` — Landing page architecture audit
- `@stitch-ui-design` — Design system token extraction

When asked to debug or refactor:
- `@debugging-strategies` — Systematic troubleshooting
- `@frontend-dev-guidelines` — Best practices enforcement
- `@ui-visual-validator` — Visual correctness checking

---

## VERIFICATION CHECKLIST (run before every PR/commit)

- [ ] All colors use CSS custom property tokens
- [ ] No hardcoded spacing values
- [ ] Animations within 150–400ms range
- [ ] Mobile layout tested at 375px width
- [ ] No horizontal scroll at any viewport
- [ ] All buttons ≥ 44px touch target
- [ ] `prefers-reduced-motion` respected
- [ ] No Lorem Ipsum / placeholder text
- [ ] No inline JS event handlers in HTML
- [ ] Canvas animation uses requestAnimationFrame
