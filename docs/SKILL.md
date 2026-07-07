---
name: design-univet-rstheme-com
description: Design system extracted from Blue University Two (https://univet.rstheme.com/html/blue-two.html). Use when building UI that should match this brand's visual identity.
triggers:
  - "Blue University Two"
  - "univet-rstheme-com"
  - "design like Blue University Two"
  - "Blue University Two風"
source: https://univet.rstheme.com/html/blue-two.html
extractedAt: 2026-07-07T09:22:05.456Z
tags: ["light", "rounded", "accented", "bold-typography", "serif"]
---
# Design System Inspired by Blue University Two

> Auto-extracted from `https://univet.rstheme.com/html/blue-two.html` on 2026-07-07

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

The hero section leads with "Foundation  of your future starts here" followed by "View Our Programs
                                                            View Our Programs".

**Key Characteristics:**
- Prata as the heading font
- Inter as the body font for all running text
- Heading weight 400, letter-spacing -1px
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#fdc72f` used for CTAs and brand highlights
- 8 shadow level(s) detected — tinted shadows
- Rounded corners (50px+) creating a friendly, approachable feel
- Tags: light, rounded, accented, bold-typography, serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#fdc72f`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#ff8e2b`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#07294d`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#4c4c4c`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#666666`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#f6f4ee`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | section | large | text-dark |
| 2 | `#07294d` | `--palette-2` | block | large | text-light |
| 3 | `#f6f4ee` | `--palette-3` | section | large | text-dark |
| 4 | `#003a65` | `--palette-4` | badge | large | text-light |
| 5 | `#003359` | `--palette-5` | button | large | text-light |
| 6 | `#fdc72f` | `--palette-6` | text-accent | large | text-dark |
| 7 | `#001936` | `--palette-7` | block | large | text-light |
| 8 | `#000000` | `--palette-8` | button | small | text-light |
| 9 | `#ff8e2b` | `--palette-9` | text-accent | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `Prata`, sans-serif
- **Body Font:** `Inter`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Prata | 86px | 400 | 103.2px | -1px |
| H2 | Prata | 46px | 600 | 63.94px | normal |
| H4 | Bitter | 20px | 600 | 26.6px | normal |
| Body | Inter | 16px | 400 | 28px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `120px` | headings |
| H1 | `86px` | headings |
| H2 | `70px` | headings |
| H3 | `60px` | headings |
| H4 | `46px` | headings |
| Body L | `24px` | body / supporting text |
| Body | `22px` | body / supporting text |
| Small | `20px` | body / supporting text |
| XS | `18.9px` | body / supporting text |
| Caption | `18px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: #fdc72f;
  color: #000000;
  border-radius: 100px;
  padding: 14px 26px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #f6f4ee;
  color: #4c4c4c;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #ffffff;
  color: #4c4c4c;
  border-radius: 50px;
  padding: 0px 0px;
  font-size: 13px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Pill Button

```css
.btn-pill {
  background: transparent;
  color: #ffffff;
  border-radius: 100px;
  padding: 0px 0px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #051435;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 3

```css
.btn-filled-3 {
  background: #ffffff;
  color: #4c4c4c;
  border-radius: 30px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: 4px solid rgb(253, 199, 47);
  cursor: pointer;
}
```

## 5. Layout Principles

- **Base spacing unit:** `11px` — use multiples (22px, 33px, 44px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `11px` | element |
| spacing-2 | `30px` | card |
| spacing-3 | `12px` | element |
| spacing-4 | `5px` | element |
| spacing-5 | `14px` | element |
| spacing-6 | `35px` | card |
| spacing-7 | `28px` | card |
| spacing-8 | `45px` | card |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-card | `50px` | card |
| radius-pill | `150px` | pill |
| radius-button | `12px` | button |
| radius-card | `16px` | card |
| radius-button | `8px` | button |
| radius-pill | `100px` | pill |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Deep | `rgba(0, 0, 0, 0.06) 0px 4px 30px 0px` | Hero sections, deep layers |
| Mid | `rgba(0, 0, 0, 0.1) 0px 4px 10px -2px` | Dropdowns, popovers |
| Deep | `rgba(0, 0, 0, 0.04) 0px 4px 30px 0px` | Hero sections, deep layers |
| High | `rgba(0, 0, 0, 0.1) 0px 4px 20px 0px` | Modals, floating elements |
| Deep | `rgba(0, 0, 0, 0.07) 0px 0px 25px 0px` | Hero sections, deep layers |

> **Note:** This site uses chromatic (color-tinted) shadows rather than pure black — this is a deliberate brand choice that adds warmth to elevation.

## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `Prata` for all headings and `Inter` for body text
- Use `#fdc72f` as the single dominant accent/CTA color
- Maintain `11px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`50px`+) consistently for all interactive elements
- Use serif fonts for headlines to maintain editorial authority
- Make headlines large and bold — typography is the hero element
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 400 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Prata/Inter with generic alternatives
- Don't use irregular spacing — stick to 11px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't mix in geometric sans-serif headlines — it breaks the editorial tone
- Don't use pure black (#000000) for text — use `#4c4c4c` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 11px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #4c4c4c
Accent:      #fdc72f
Secondary:   #ff8e2b
Border:      #f6f4ee
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `Prata` heading in `#4c4c4c`, and a `#fdc72f` CTA button with 100px radius."
2. "Create a pricing card using background `#07294d`, border `#f6f4ee`, `Inter` for text, and 33px padding."
3. "Design a navigation bar — `#ffffff` background, `#4c4c4c` links, `#fdc72f` for active state."
4. "Build a feature grid with 3 columns, 33px gap, each card using the card component style."
5. "Create a footer with `#4c4c4c` background, `#ffffff` text, and 22px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 69 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--swiper-theme-color` | `#007aff` |
| `--rs-white` | `#FFFFFF` |
| `--rs-black` | `#000` |
| `--rs-light` | `#eee` |
| `--rs-green` | `#54BD05` |
| `--rs-yellow` | `#F69C00` |
| `--rs-pink` | `#E033E0` |
| `--rs-red` | `#E80000` |
| `--rs-theme-blue` | `#003A65` |
| `--rs-theme-blue-two` | `#07294D` |
| `--rs-theme-yellow` | `#FDC72F` |
| `--rs-theme-cyan` | `#0C5776` |
| `--rs-theme-light-cyan` | `#00ADE2` |
| `--rs-theme-red` | `#960B27` |
| `--rs-theme-red-two` | `#A50034` |
| `--rs-theme-green` | `#2F584F` |
| `--rs-theme-green-two` | `#15A656` |
| `--rs-text-primary` | `#4C4C4C` |
| `--rs-text-secondary` | `#656565` |
| `--rs-title-primary` | `#030303` |
| `--rs-title-secondary` | `#1D1D1B` |
| `--rs-title-tertiary` | `#051435` |
| `--rs-bg-primary` | `#F6F4EE` |
| `--rs-bg-secondary` | `#F4F3F3` |
| `--rs-bg-black` | `#231F20` |
| `--rs-bg-dark-blue` | `#2F3E4B` |
| `--rs-bg-blue` | `#003A65` |
| `--rs-border-primary` | `#E4E4E4` |
| `--rs-border-secondary` | `rgba(255, 255, 255, 0.15)` |
| `--rs-border-tertiary` | `rgba(255, 255, 255, 0.1)` |
| ... | *(6 more)* |

### Spacing Variables

| Variable | Value |
|---|---|
| `--bs-breakpoint-xs` | `0` |
| `--bs-breakpoint-sm` | `576px` |
| `--bs-breakpoint-md` | `768px` |
| `--bs-breakpoint-lg` | `992px` |
| `--bs-breakpoint-xl` | `1200px` |
| `--bs-breakpoint-xxl` | `1400px` |
| `--swiper-navigation-size` | `44px` |
| `--rs-fw-thin` | `100` |
| `--rs-fw-elight` | `200` |
| `--rs-fw-light` | `300` |
| `--rs-fw-regular` | `400` |
| `--rs-fw-medium` | `500` |
| `--rs-fw-sbold` | `600` |
| `--rs-fw-bold` | `700` |
| `--rs-fw-ebold` | `800` |
| `--rs-fw-black` | `900` |
| `--rs-fs-body` | `16px` |
| `--rs-fs-p` | `16px` |
| `--rs-fs-h1` | `64px` |
| `--rs-fs-h2` | `48px` |
| ... | *(8 more)* |

### Other Variables

| Variable | Value |
|---|---|
| `--rs-ff-body` | `"Inter", sans-serif` |
| `--rs-ff-title` | `"Bitter", sans-serif` |
| `--rs-ff-p` | `"Inter", sans-serif` |
| `--rs-ff-remixicon` | `"remixicon"` |
| `--rs-fw-normal` | `normal` |
