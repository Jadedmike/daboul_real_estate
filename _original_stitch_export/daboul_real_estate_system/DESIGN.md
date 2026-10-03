---
name: Daboul Real Estate System
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#46464b'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#76777b'
  outline-variant: '#c7c6cb'
  surface-tint: '#5e5e62'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1f'
  on-primary-container: '#848387'
  inverse-primary: '#c7c6ca'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#fe6b00'
  on-secondary-container: '#572000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191b21'
  on-tertiary-container: '#82838b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3e2e6'
  primary-fixed-dim: '#c7c6ca'
  on-primary-fixed: '#1b1b1f'
  on-primary-fixed-variant: '#46464a'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#e2e2ea'
  tertiary-fixed-dim: '#c5c6ce'
  on-tertiary-fixed: '#191b21'
  on-tertiary-fixed-variant: '#45474d'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 34px
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-sm:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system defines an authoritative, Arabic-first luxury real estate experience tailored for the Syrian and Levantine premium property market. Rooted in architectural clarity, the aesthetic reflects prestige, trust, and timeless regional craftsmanship.

### Aesthetic Movement & Tone
- **High-End Architectural Minimalism:** Structured around expansive whitespace, stark contrast, and razor-sharp geometric alignment reminiscent of modernist residential blueprints.
- **RTL-Native Elegance:** Built from the ground up for right-to-left visual flow, ensuring typographic rhythm, directional cues, and spatial balances prioritize Arabic reading patterns without compromising bilingual parity.
- **Controlled Warmth:** Balanced between grounded deep charcoal monoliths and an energetic architectural ember-orange derived from the brand mark, providing high-focus intentional accents without loud or playful distractions.
- **Emotional Resonance:** Security, permanence, refined curation, and bespoke property investment.

## Colors
The palette utilizes high-contrast monochrome tones with a single, highly deliberate warm accent. No extraneous hues (blues, greens, purples) are permitted.

### Palette Architecture
- **Primary Charcoal (`#121316` / `#1A1C20`):** Acts as the primary anchor for dominant CTAs, typography, structural borders, and header bars. Evokes architectural slate and obsidian.
- **Brand Ember (`#FF6B00` / `#F97316`):** The signature accent, extracted directly from the window emblem. Reserved strictly for key conversion actions, active property status badges, selected tab indicators, and interactive highlights.
- **Neutral Architectural Canvas (`#FAFAFA` / `#F4F4F6`):** Clean, warm neutral surfaces that eliminate clinical coldness while maximizing property photography impact.
- **Border & Hairline Gray (`#E4E4E7`):** Fine, whisper-thin divider lines that structure property matrices cleanly.
- **Muted Charcoal (`#6B7280`):** Used for secondary architectural specifications (area, room count, cadastral reference numbers).

## Typography
Typographic discipline is anchored by **IBM Plex Sans** (with full Arabic glyph parity through IBM Plex Sans Arabic). This pairing grants technical geometric discipline suited for real estate listings, floor plans, and architectural specifications, while ensuring exceptional legibility across both Arabic and Latin letterforms.

### RTL Typography Rules
- **Line Heights:** Arabic typography requires slightly expanded vertical line spacing (`line-height` standard 1.5–1.7x) relative to Latin scripts to ensure ascenders, descenders, and diacritics do not collide.
- **Numerals:** Financial values, prices, and surface areas use clear standardized figures aligned consistently to property card grids.
- **Text Alignment:** Strict right-alignment (`text-align: right`) across all narrative blocks, with mirrored inline labels and iconography.

## Layout & Spacing
The layout model employs a clean, proportion-focused 12-column fluid grid on desktop transitioning to an 8-column layout on tablet and a 4-column layout on mobile.

### Spatial Rhythms & Directionality
- **RTL Fluidity:** Structural gutters flow seamlessly from right to left. Property meta tags (bedroom, bathroom, square meters) anchor to the right margin of card enclosures.
- **Negative Space:** Property features and architectural floor-plan diagrams are granted generous breathing room (`space-xl`) to establish luxury perception.
- **Section Rhythm:** Major landing modules and property showcases utilize `margin` gutters of `3rem` to prevent visual clutter and keep attention focused on imagery.

## Elevation & Depth
Depth in this design system is subdued and architectural, avoiding generic heavy drop shadows or flashy neon glows.

### Elevation Principles
- **Tier 0 (Base Canvas):** Background tone `#FAFAFA` with zero elevation.
- **Tier 1 (Cards & Surface Panels):** Pure `#FFFFFF` resting on `#FAFAFA`, delineated by an ultra-thin border (`1px solid #E4E4E7`) paired with an ambient shadow: `box-shadow: 0 1px 3px rgba(18, 19, 22, 0.04), 0 8px 24px -4px rgba(18, 19, 22, 0.04)`.
- **Tier 2 (Hovered Properties & Flyouts):** Slightly elevated states translate 2px upwards with an expanded shadow: `box-shadow: 0 12px 32px -6px rgba(18, 19, 22, 0.08)`.
- **Tier 3 (Modals & Inquiry Sheets):** Pure white sheets framed with subtle charcoal backdrop scrims (`rgba(18, 19, 22, 0.45)`).

## Shapes
The shape language takes inspiration from contemporary Syrian and international stone architecture—crisp, refined, and grounded. 

A restrained **Soft (`1`)** roundedness scale is maintained:
- **Base Elements (`rounded`):** `0.25rem` (4px) on inputs, filter chips, and badges.
- **Cards & Surfaces (`rounded-lg`):** `0.5rem` (8px) on property showcase cards, map preview windows, and media frames.
- **Modal Dialogs & Drawers (`rounded-xl`):** `0.75rem` (12px) on prominent containers.
- **No Full Pills:** Pill-shaped buttons are rejected to avoid a casual or playful consumer feel; buttons preserve tailored, precision-cut corners.

## Components

### Buttons
- **Primary CTA:** Solid Deep Charcoal (`#121316`) background, pure white text, 4px rounded corners, padding `12px 24px`. Hover initiates a warm ember accent border and subtle lift.
- **Accent CTA (Featured Contact/Call):** Vibrant Orange (`#FF6B00`) background, crisp white typography, high contrast against light surfaces.
- **Secondary / Outline:** White surface with a `1px solid #121316` perimeter and charcoal typography. Hover shifts to `#F4F4F6`.
- **Icon Alignment:** In RTL mode, action arrows or icons point inward to the left (`transform: scaleX(-1)` for directional navigation).

### Property Cards
- Structured with a 16:10 aspect ratio image container topped with a discreet status badge (e.g., "للبيع" / "حجوز") styled in `#121316` or `#FF6B00`.
- Card body features a bold headline in Charcoal `#121316`, secondary district address in `#6B7280`, and a dedicated meta-bar displaying Arabic numerals for area ($m^2$), bedrooms, and baths separated by refined 1px vertical borders.

### Input Fields & Search Filters
- Surfaces are crisp `#FFFFFF` with `1px solid #E4E4E7` borders. Focused states trigger a razor-thin `#121316` outline and a delicate 1px `#FF6B00` inner glow.
- Labels are right-aligned, floating cleanly with balanced line heights.

### Chips & Badges
- Filter chips (e.g., "شقق فاخرة", "فلل", "تجاري") feature a `#F4F4F6` background with `#121316` text. Active state transitions to `#121316` fill with white text and an orange indicator dot.

### Checkboxes & Radios
- Square profile with minimal 2px corner radius. In selected state, checkboxes fill with `#121316` featuring a sharp white checkmark. Radios display a `#FF6B00` center point.