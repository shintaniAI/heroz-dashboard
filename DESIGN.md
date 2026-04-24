---
version: alpha
name: HEROZZ Executive Console
description: A dense, data-forward executive dashboard that reads like a financial terminal — disciplined typography, tabular numerics, and sparing use of color for semantic signal only.
colors:
  background: "#0A0A0B"
  surface: "#111114"
  surface-elevated: "#17171C"
  surface-hover: "#1C1C22"
  border: "#242429"
  border-strong: "#33333B"
  text-primary: "#FAFAFA"
  text-secondary: "#A1A1AA"
  text-tertiary: "#71717A"
  text-muted: "#52525B"
  accent: "#F5A524"
  accent-dim: "#B45309"
  success: "#10B981"
  success-dim: "#047857"
  warning: "#F59E0B"
  warning-dim: "#B45309"
  danger: "#EF4444"
  danger-dim: "#B91C1C"
  info: "#0EA5E9"
typography:
  display:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 700
    letterSpacing: -0.03em
    lineHeight: 1
  h1:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: 700
    letterSpacing: -0.025em
  h2:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 600
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
  caption:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: 600
    letterSpacing: 0.08em
  numeric-hero:
    fontFamily: JetBrains Mono
    fontSize: 2.25rem
    fontWeight: 600
    letterSpacing: -0.03em
    fontFeature: "tnum"
  numeric-lg:
    fontFamily: JetBrains Mono
    fontSize: 1.5rem
    fontWeight: 600
    fontFeature: "tnum"
  numeric:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: 500
    fontFeature: "tnum"
rounded:
  none: 0
  sm: 4px
  md: 6px
  lg: 10px
  xl: 14px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 20px
  card-hover:
    backgroundColor: "{colors.surface-elevated}"
  metric-label:
    typography: "{typography.caption}"
    textColor: "{colors.text-tertiary}"
  metric-value:
    typography: "{typography.numeric-hero}"
    textColor: "{colors.text-primary}"
  chip:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: 4px 8px
---

## Overview

**Financial Terminal meets Editorial Restraint.** HEROZZ Executive Console takes its cues from Bloomberg and Stripe: dense information, confident typography, almost no decoration. Every pixel earns its place. Numbers — not gradients, icons, or illustrations — are the visual hero.

The user is a CEO/CMO scanning for signal in seconds. The design must reward that scan: dominant numerics, quiet labels, color only where it conveys meaning (success / warning / danger).

## Colors

Three tiers of dark surface give structure without heavy borders. A warm amber accent — used sparingly — flags the single most important metric on a screen. Semantic colors (success/warning/danger) are reserved for KPIs where performance must be telegraphed at a glance.

- **Background (#0A0A0B):** Near-black base, warm-shifted. Feels like ink, not plastic.
- **Surface (#111114):** Default card fill. Subtle lift from background.
- **Surface Elevated (#17171C):** Hover / nested emphasis.
- **Border (#242429):** Hairline separator — never bold.
- **Text Primary (#FAFAFA):** Numbers, headlines. High contrast.
- **Text Secondary (#A1A1AA):** Labels, captions.
- **Text Tertiary (#71717A):** Meta, separators, footnotes.
- **Accent (#F5A524):** Amber gold. Reserved for "this is the number that matters most." Do not use decoratively.
- **Success (#10B981):** On-pace or better. ≥90% to target.
- **Warning (#F59E0B):** Off-pace. 60–89% to target.
- **Danger (#EF4444):** At-risk. <60% to target, or negative margin.

## Typography

Two families, deliberately distinct: **Inter** for prose and UI chrome, **JetBrains Mono** for all numerics. The mono face signals "this is data" and keeps columns aligned without fighting tabular-nums.

- **Display (48px/700):** The single hero number per screen (売上実績).
- **Numeric Hero (36px mono/600):** KPI top-line values.
- **Numeric LG (24px mono/600):** Secondary values in tables and funnel stages.
- **Numeric (14px mono/500):** Inline data in tables.
- **Caption (11px/600, 0.08em tracking, uppercase):** Section labels and metric names. The caps-tracked style is a deliberate "terminal" nod.
- **Body (14px/400):** Helper text, tooltips.

## Layout

- **Grid:** 12-column implicit, 24px gutter at desktop, 16px at mobile.
- **Section spacing:** 24px between sections (never more — density is a feature, not a bug).
- **Card padding:** 20px. Interior spacing falls back on the spacing scale.
- **Max width:** 1280px. Above that, whitespace grows but content never stretches.

The screen tells one story top-to-bottom: **hero KPIs → funnel → cost structure → media / channels → time series → people / plans**. Each band answers a different executive question.

## Elevation & Depth

Depth is expressed through **surface brightness**, not shadows. Shadows feel like consumer UI; this is an operating console. A hovered card brightens one step (`surface → surface-elevated`) with a 150ms transition. No drop shadows, no glows, no frosted glass.

## Shapes

Corners are restrained — 10px on cards, 6px on chips, 4px on internal controls. Nothing is pill-shaped; progress bars and status chips keep a short, engineering-drawing feel.

## Components

- **card:** Flat fill, 1px border at `border`, 10px radius, 20px padding. No shadow.
- **metric-label:** Caption typography, uppercase, tracked.
- **metric-value:** Numeric hero, white, tabular.
- **chip:** Small monospace pill for status / progress readouts.
- **table row:** 12px vertical padding, bottom-hairline separator at `border`. Zebra striping is forbidden — it reads as noise.
- **progress bar:** 4px tall, `border` track, semantic fill. No rounding of the fill end.

## Do's and Don'ts

- **Do** lead with the number. Label below or above, never alongside.
- **Do** use mono for every numeric output.
- **Do** reserve color for semantic meaning.
- **Don't** use gradients on cards, backgrounds, or borders.
- **Don't** put icons next to every KPI — one per card at most, and only when it adds scanability.
- **Don't** use drop shadows, glows, or glassmorphism.
- **Don't** center body copy. Data is left/right aligned; prose is left aligned.
- **Don't** introduce a new color outside the token palette.
