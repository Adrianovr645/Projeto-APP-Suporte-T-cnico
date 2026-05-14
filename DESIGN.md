---
name: Integrated ITSM Design System
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style
The design system is engineered for efficiency, reliability, and high-density information management. The target audience includes IT professionals, system administrators, and support agents who require a tool that minimizes cognitive load while maximizing data visibility.

The visual style is **Corporate / Modern**, characterized by a systematic approach to hierarchy and state management. It prioritizes utility over decoration, utilizing a "function-first" aesthetic that ensures critical alerts are immediately actionable. The atmosphere is calm and professional, using deep navy tones to establish authority and trust, while light neutral surfaces maintain a clean, breathable workspace for prolonged usage.

## Colors
The palette is rooted in a **Deep Navy** primary color, used for navigation and high-level branding to provide a sense of stability. Backgrounds utilize a sequence of cool, light grays to separate content zones without creating harsh visual breaks.

Functional colors are strictly reserved for status communication:
- **Deep Navy (#0F172A):** Primary actions and structural elements.
- **Red (#DC2626):** Critical tickets, system outages, and high-priority SLA breaches.
- **Yellow (#EAB308):** Pending tasks, electrical infrastructure issues, or warnings.
- **Green (#16A34A):** Resolved tickets and healthy system status.
- **Blue (#2563EB):** General IT service requests and standard operational tasks.

## Typography
This design system utilizes **Inter** for all interfaces. It was chosen for its exceptional legibility in data-heavy environments and its neutral, professional character.

The typographic scale focuses on clarity:
- **Headlines:** Used for dashboard titles and ticket IDs. Bold weights ensure clear entry points into content.
- **Body:** The 14px size is the workhorse for ticket descriptions and logs, balancing density with readability.
- **Labels:** Small, semi-bold, uppercase labels are used for metadata headers (e.g., "ASSIGNED TO", "DATE CREATED") to differentiate them from the user-generated content.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a single-column stack for mobile. 

A strict 4px baseline grid ensures vertical rhythm. Data density is managed through "Comfortable" and "Compact" view modes:
- **Standard View:** Uses 16px (md) padding within cards and list items.
- **Compact View:** Reduces internal padding to 8px (sm) for power users viewing large ticket queues.

Margins are kept consistent at 24px on desktop to provide a framing effect that keeps the focus on the central data tables. Content should reflow based on priority; on mobile, sidebars collapse into a bottom navigation bar or a "hamburger" drawer.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. This design system avoids heavy drop shadows, opting instead for subtle, low-opacity diffusions that lift active elements slightly from the background.

- **Level 0 (Background):** Light gray (#F8FAFC), used for the main application canvas.
- **Level 1 (Cards/Surface):** White (#FFFFFF) with a 1px border (#E2E8F0). This is the default state for ticket items and content containers.
- **Level 2 (Hover/Active):** White with a soft shadow (0px 4px 6px -1px rgba(0, 0, 0, 0.1)). Used when a user interacts with a ticket card.
- **Level 3 (Modals/Overlays):** White with a more pronounced shadow (0px 10px 15px -3px rgba(0, 0, 0, 0.1)) to focus attention and dim the background.

## Shapes
The shape language is professional and restrained. UI elements utilize **Soft (0.25rem)** roundedness to appear modern without feeling overly "playful" or consumer-grade.

- **Buttons & Inputs:** 4px (0.25rem) radius.
- **Cards & Containers:** 8px (0.5rem) radius for a slightly softer frame.
- **Status Tags (Chips):** 4px radius or fully rounded (pill) depending on the context of the metadata.
- **Icon Enclosures:** Small circular backgrounds for secondary actions.

## Components
- **Buttons:** Primary buttons use the Navy Blue (#0F172A) with white text. Ghost buttons (border only) are used for secondary actions like "Cancel" or "Export."
- **Status Chips:** Highly recognizable badges using the functional color palette. They include a subtle 10% opacity background of the color with a 100% opacity text color for maximum readability (e.g., Light Red background with Dark Red text).
- **Data Tables:** Clean rows with 1px bottom borders. The header row should be slightly darker (#F1F5F9) to anchor the data.
- **Input Fields:** High-contrast borders (#E2E8F0) that turn Navy Blue on focus. Error states use the functional Red.
- **Icons:** Use 24px linear (outline) icons with a 1.5px or 2px stroke weight. Avoid filled icons unless indicating an "active" navigation state.
- **SLA Progress Bars:** Thin, linear bars using functional colors to indicate time remaining before a ticket breaches.