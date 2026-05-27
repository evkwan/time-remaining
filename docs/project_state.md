# Project state

Handoff file for AI and human contributors. Update after meaningful work per `.cursor/rules/project-state-handoff.mdc`.

## Current phase

**Revamp complete — ready for Vercel deploy.** Core UI, modern stack, and SEO foundations are in place. Optional follow-ups: OG image, tests, theme toggle.

## Next up

- [ ] Set `NEXT_PUBLIC_SITE_URL` in Vercel project settings to production domain
- [ ] Deploy to Vercel and verify `/sitemap.xml`, `/robots.txt`, and meta tags
- [ ] Add branded `opengraph-image.tsx` for social previews
- [ ] (Optional) Unit tests for `src/lib/time.ts`
- [ ] (Optional) Light/dark mode toggle

## Decisions locked

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-05-27 | Next.js 15 App Router + React 19 | Latest stable stack; Vercel-native |
| 2026-05-27 | shadcn/ui (New York, neutral) + Tailwind 3 | Minimalist UI, accessible primitives |
| 2026-05-27 | Luxon for all date math | Already in project; handles local TZ and ISO week |
| 2026-05-27 | Single client component (countdown only) | Minimize JS; RSC for static year context |
| 2026-05-27 | Quote selected by day-of-year index | SSR/hydration stable; one quote per day |
| 2026-05-27 | Dark theme default via `className="dark"` on `<html>` | Minimalist look; system toggle deferred |
| 2026-05-27 | Components under `src/components/`, not `src/app/components/` | Aligns with shadcn aliases and Next conventions |

## Log

| Date | Summary |
| --- | --- |
| 2026-05-27 | **Full revamp:** Upgraded to Next.js 15 / React 19 / TypeScript strict. Added shadcn/ui (Card, Badge, Separator), Geist fonts, dark minimalist layout. Extracted `lib/time`, `lib/quotes`, `lib/site`. Replaced legacy components with `CountdownTimer`, `YearContextPanel`, `MotivationQuote`, `SiteHeader`, `SiteFooter`. SEO: Metadata API, OG/Twitter, JSON-LD, sitemap, robots. Added README, `.env.example`, `docs/TECHNICAL_IMPLEMENTATION_PLAN.md`. Removed `@next/font`, old `src/app/components/*`. |
