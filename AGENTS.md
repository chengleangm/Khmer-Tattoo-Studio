# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js 16, TypeScript, and Tailwind CSS marketing site for Khmer Tattoo Studio. App Router pages live in `app/`, with route folders such as `app/gallery/`, `app/artists/`, `app/booking/`, and shared layout/styles in `app/layout.tsx` and `app/globals.css`. Reusable UI belongs in `components/`; keep components small and prefer existing primitives such as `Button`, `ImageCard`, and `SectionTitle`. Static content and translations are centralized in `data/site.ts` and `data/translations.ts`; update these before hard-coding copy in pages. Language state is in `contexts/LanguageContext.tsx`. Public assets belong in `public/images/`, with source notes in `public/images/IMAGE_SOURCES.md`.

## Build, Test, and Development Commands

- `npm run dev` starts the local dev server at `http://localhost:3001`.
- `npm run build` creates a production build and catches Next.js/TypeScript integration issues.
- `npm run start` serves the production build after `npm run build`.
- `npm run lint` runs ESLint across the repository.

Run commands from the repository root. Do not commit `.next/`, `node_modules/`, logs, or generated screenshots unless intentionally requested.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing two-space indentation, double quotes, semicolons, and Tailwind utility-first styling. Component files use PascalCase, for example `components/GalleryGrid.tsx`; route files follow Next.js conventions such as `app/contact/page.tsx`. Use the `@/*` path alias for internal imports. Mark files with `"use client"` only when they need hooks, event handlers, or browser APIs.

## Testing Guidelines

No automated test suite is currently configured. For now, validate changes with `npm run lint` and `npm run build`. For UI changes, run `npm run dev` and manually check affected routes at desktop and mobile widths. If tests are added later, place focused tests near the code they cover and document the runner command here.

## Commit & Pull Request Guidelines

Recent commits use short, plain-language summaries such as `fix it please`, `en to kh`, and `Initial commit: Khmer Tattoo Studio Next.js site`. Keep future commit messages concise and imperative, for example `Update gallery translations`. Pull requests should include a brief description, affected routes/components, verification steps (`npm run lint`, `npm run build`), and screenshots for visual changes.

## Security & Configuration Tips

Forms in `BookingForm` and `ContactForm` are client-side stubs with no backend submission. Do not add secrets to source files or public assets. Put environment-specific values in local `.env*` files and document required variables without exposing values.
