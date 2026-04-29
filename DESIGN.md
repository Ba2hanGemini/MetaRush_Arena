# DESIGN.md — METARUSH Design DNA
# Extracted from project design system | Auto-reference for all AI agents
# Last updated: April 2025

---

## DESIGN PHILOSOPHY

**Keyword:** "Neo-Dark Web3 Arena"  
**Aesthetic:** Deep space darkness + neon plasma + glassmorphic surfaces + competitive energy  
**Mood:** Premium crypto-native, trustworthy, adrenaline-inducing, exclusive  
**Inspiration:** Early MetaWin (2022) × CS:GO skins marketplace × Apple product reveal pages

---

## COLOR PALETTE

### Primary Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#06060e` | Page background, deepest layer |
| `--bg-secondary` | `#0b0b1e` | Section backgrounds |
| `--bg-tertiary` | `#101030` | Elevated surfaces |
| `--bg-card` | `rgba(13,13,35,0.65)` | Glass cards (with backdrop-filter) |
| `--bg-card-hover` | `rgba(20,20,55,0.8)` | Cards on hover |

### Accent / Brand
| Token | Hex | Glow | Usage |
|-------|-----|------|-------|
| `--accent-purple` | `#7c3aed` | `rgba(124,58,237,0.35)` | Primary CTA, gradients, borders |
| `--accent-purple-light` | `#a78bfa` | — | Text accents, links |
| `--accent-cyan` | `#06b6d4` | `rgba(6,182,212,0.3)` | Timers, secondary accents |
| `--accent-green` | `#10b981` | `rgba(16,185,129,0.3)` | LIVE status, wins, success |
| `--accent-gold` | `#f59e0b` | `rgba(245,158,11,0.3)` | Legendary rewards, gold tier |
| `--accent-red` | `#ef4444` | — | Errors, ended state |
| `--accent-pink` | `#ec4899` | — | Diamond tier, special highlights |
| `--accent-diamond` | `#818cf8` | — | Diamond box, premium tier |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#f1f5f9` | Headings, primary body |
| `--text-secondary` | `#94a3b8` | Labels, descriptions |
| `--text-muted` | `#64748b` | Placeholders, timestamps |
| `--text-accent` | `#a78bfa` | Links, highlighted text |

### Chain Brand Colors
| Chain | Hex | Usage |
|-------|-----|-------|
| Ethereum | `#627eea` | ETH badges, icons |
| Solana | `#9945ff` | SOL badges, icons |
| Base | `#0052ff` | Base badges, icons |

---

## GRADIENTS

```css
/* Primary — used on CTAs, headings */
--gradient-primary: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);

/* Hero title — animated */
--gradient-hero: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);

/* Gold — legendary rewards */
--gradient-gold: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);

/* Diamond — highest tier */
--gradient-diamond: linear-gradient(135deg, #818cf8 0%, #ec4899 100%);

/* Nature/success */
--gradient-green: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);

/* Background radial glow (top of page) */
--gradient-bg-radial: radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%);
```

---

## TYPOGRAPHY

### Font Family
- **Display/Headers:** `'Orbitron', monospace` — Futuristic, crypto-native
- **Body/UI:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` — Clean, readable

### Type Scale
| Element | Size | Weight | Font | Notes |
|---------|------|--------|------|-------|
| Hero Title | `clamp(2.5rem, 6vw, 4.5rem)` | 900 | Orbitron | Gradient fill |
| Section Title | `clamp(1.5rem, 3vw, 2.25rem)` | 700 | Orbitron | Gradient fill, letter-spacing: 1px |
| Prize Value | `1.75rem–2.5rem` | 800 | Orbitron | Gradient fill |
| Stat Value | `clamp(1.4rem, 3vw, 2rem)` | 700 | Orbitron | — |
| Chain Badge | `0.75rem` | 600 | Inter | Uppercase, letter-spacing: 0.5px |
| Body | `15px` | 400 | Inter | line-height: 1.6 |
| Small/Labels | `0.8rem` | 500 | Inter | letter-spacing: 1px, uppercase |

---

## SPACING SCALE

```
--space-2xs: 0.125rem  (2px)
--space-xs:  0.25rem   (4px)
--space-sm:  0.5rem    (8px)
--space-md:  1rem      (16px)
--space-lg:  1.5rem    (24px)
--space-xl:  2rem      (32px)
--space-2xl: 3rem      (48px)
--space-3xl: 4rem      (64px)
--space-4xl: 6rem      (96px)
```

---

## BORDER RADIUS

```
--radius-sm:   6px
--radius-md:   10px
--radius-lg:   16px
--radius-xl:   24px
--radius-full: 9999px  (pills, status badges)
```

---

## SHADOWS & GLOW EFFECTS

| Shadow Token | Value | Usage |
|-------------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.3)` | Small cards |
| `--shadow-md` | `0 4px 24px rgba(0,0,0,0.4)` | Cards |
| `--shadow-lg` | `0 8px 48px rgba(0,0,0,0.5)` | Modals, large elements |
| `--shadow-glow-purple` | `0 0 30px rgba(124,58,237,0.35)` | Primary hover glow |
| `--shadow-glow-cyan` | `0 0 30px rgba(6,182,212,0.3)` | Secondary glow |
| `--shadow-glow-green` | `0 0 30px rgba(16,185,129,0.3)` | Success/live glow |
| `--shadow-glow-gold` | `0 0 30px rgba(245,158,11,0.3)` | Legendary glow |

---

## ANIMATION SYSTEM

### Timing Functions
```
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)  ← Primary easing
--transition-fast: 150ms ease-out-expo
--transition-base: 300ms ease-out-expo
--transition-slow: 500ms ease-out-expo
```

### Animation Vocabulary
| Animation | Duration | Trigger | Purpose |
|-----------|----------|---------|---------|
| `fadeInUp` | 800ms | Page load | Section reveals |
| `logo-pulse` | 3s infinite | Always | Draws eye to logo |
| `blink` | 1.5s infinite | LIVE status | Indicates real-time |
| `float` | 3s infinite | Loot box icons | Playful, inviting |
| `shimmer` | 2s infinite | Progress bars | Loading feel |
| `rotateGlow` | 8s infinite | Box cards | Premium ambient |
| `gradientShift` | 4s infinite | Hero title | Alive, dynamic |
| `confettiFall` | 2–4s | Win event | Celebration |
| `spin` | 1s linear | Loading state | Clear feedback |
| `toastIn/Out` | 400ms/300ms | Notifications | Polish |

---

## COMPONENT PATTERNS

### Glass Card
```css
background: rgba(13,13,35,0.65);
backdrop-filter: blur(16px);
border: 1px solid rgba(139,92,246,0.12);
border-radius: 16px;
/* Hover: border-color → rgba(139,92,246,0.2), transform: translateY(-4px) */
```

### Status Badges
- **LIVE:** Green pill with animated dot — `rgba(16,185,129,0.12)` bg
- **FILLING:** Gold pill — `rgba(245,158,11,0.12)` bg
- **ENDED:** Gray pill — `rgba(100,116,139,0.12)` bg

### Progress Bars
- Height: 6px, border-radius: full
- Fill: `--gradient-primary` with shimmer overlay
- Track: `rgba(124,58,237,0.1)`

### Buttons
- **Primary (btn-primary):** Gradient background + glow shadow + shimmer on hover + translateY(-2px)
- **Secondary (btn-secondary):** Transparent + border + hover fill
- **Wallet (btn-wallet):** Orbitron font, uppercase, pill shape, connected → green state
- Min height: 44px, min width: 44px

---

## LAYOUT GRID

### Competitions
```css
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
gap: 2rem;
```

### Loot Boxes
```css  
grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
gap: 2rem;
```

### Hero Stats
```css
grid-template-columns: repeat(3, 1fr);
gap: 1.5rem;
/* Mobile: grid-template-columns: 1fr; */
```

---

## LOOT BOX TIER SYSTEM

| Tier | Icon | Price | Color | Glow |
|------|------|-------|-------|------|
| Bronze | 📦 | 0.01 ETH | `#b45309` | `rgba(180,83,9,0.4)` |
| Silver | 🗃️ | 0.05 ETH | `#9ca3af` | `rgba(156,163,175,0.4)` |
| Gold | 🎁 | 0.1 ETH | `#f59e0b` | `rgba(245,158,11,0.4)` |
| Diamond | 💎 | 0.5 ETH | `#818cf8` | `rgba(129,140,248,0.4)` |

### Rarity System
| Rarity | CSS Class | Color | Bronze | Diamond |
|--------|-----------|-------|--------|---------|
| Common | `.rarity-common` | `#64748b` | 50% | 20% |
| Uncommon | `.rarity-uncommon` | `#10b981` | 30% | 30% |
| Rare | `.rarity-rare` | `#06b6d4` | 15% | 28% |
| Epic | `.rarity-epic` | `#7c3aed` | 4% | 17% |
| Legendary | `.rarity-legendary` | `#f59e0b` | 1% | 5% |

---

## RESPONSIVE BREAKPOINTS

```
Mobile:  ≤ 480px  → single column, stacked hero, no balance display
Tablet:  ≤ 768px  → mobile nav, single column competitions, 2-col lootboxes
Desktop: ≥ 1024px → full grid, side-by-side stats
Max:     1280px   → content max-width
```
