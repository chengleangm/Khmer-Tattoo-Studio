# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on http://localhost:3001
npm run build     # Production build
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16 + TypeScript + Tailwind CSS** marketing site for Khmer Tattoo Studio (Siem Reap, Cambodia).

### Structure

- `app/` — Next.js App Router pages: `page.tsx` (home), `gallery/`, `artists/`, `services/`, `booking/`, `about/`, `contact/`, `aftercare/`
- `components/` — Shared UI components (all server components unless marked `"use client"`)
- `data/site.ts` — Single source of truth for all static content: nav items, artists, gallery items, services, styles, process steps
- `public/images/` — All static images (JPGs)

### Design System

Tailwind config (`tailwind.config.ts`) extends the default theme with:

- **Colors**: `ink` (#050706), `charcoal` (#111312), `ash`, `bone`, `teal` (#c8a24a — used as gold accent)
- **Fonts**: `font-display` (Bebas Neue), `font-condensed` (Oswald), `font-sans` (Inter)
- **Letter spacing**: `tracking-editorial` (0.08em)

Global CSS (`app/globals.css`) defines:
- `.editorial-section` — adds a large ghost watermark word via `data-bg-word` attribute (e.g. `data-bg-word="GALLERY"`)
- `.grain` — subtle grid overlay for dark hero sections
- `.vertical-title` — rotated writing mode for vertical display text

### Key Patterns

- `ImageCard` wraps `next/image` with `fill` layout, grayscale-by-default hover effect, and teal overlay on hover
- `Button` renders as `<Link>` when `href` is provided; variants: `light`, `dark`, `teal`, `outline`
- `Header` is a `"use client"` component with mobile drawer nav driven by `navItems` from `data/site.ts`
- Forms (`BookingForm`, `ContactForm`) are client components with `onSubmit` stubbed — no backend wired up yet
- `TattooStyleShowcase` is an interactive client component with style picker state
- All content data (artists, services, gallery items, styles) lives in `data/site.ts` — update there first
