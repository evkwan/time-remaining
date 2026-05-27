# Technical implementation plan

Reference for stack choices and build order. See `docs/project_state.md` for current status.

## Stack

- **Next.js 15** App Router — static-friendly, Vercel-native, Metadata API for SEO
- **React 19** — latest stable with RSC
- **TypeScript strict** — type safety without runtime cost
- **Tailwind CSS 3 + shadcn/ui** — minimalist design system, accessible Radix primitives
- **Luxon** — reliable local timezone date math for countdown and calendar context
- **No backend** — frontend-only; deploy as static/SSR on Vercel

## Architecture

| Concern | Location |
| --- | --- |
| Countdown (client) | `src/components/countdown-timer.tsx` |
| Year stats (server) | `src/components/year-context-panel.tsx` |
| Date math | `src/lib/time.ts` |
| Quotes | `src/lib/quotes.ts` |
| Site / SEO config | `src/lib/site.ts` |
| Metadata, sitemap, robots | `src/app/layout.tsx`, `sitemap.ts`, `robots.ts` |

## Slice order (completed)

1. Upgrade dependencies and shadcn scaffold
2. Extract `lib/time` and `lib/quotes`
3. Rebuild UI with shadcn Card, Badge, Separator
4. SEO metadata, JSON-LD, sitemap, robots
5. README and project state handoff

## Future enhancements (optional)

- Dynamic OG image (`opengraph-image.tsx`)
- `loading.tsx` / `error.tsx` boundaries
- Unit tests for `lib/time.ts`
- Light/dark theme toggle (currently defaults to dark)
