# Project state

Handoff file for AI and human contributors. Update after meaningful work per `.cursor/rules/project-state-handoff.mdc`.

## Current phase

**Live in production at https://yearleft.app.** Stack, UI, and technical SEO foundations deployed and verified. Next focus: SEO enrichment (OG image, favicon, manifest, crawlable content, Search Console).

## Next up (next session — SEO enrichment)

- [ ] `opengraph-image.tsx` — branded 1200×630 dynamic OG image (fills blank link preview; biggest CTR win)
- [ ] Favicon — `icon.tsx` + `apple-icon.tsx` (removes generic globe in search results)
- [ ] `manifest.ts` — PWA basics / Add to Home Screen
- [ ] Crawlable About/FAQ section targeting real queries ("how many days left in the year", "what week of the year is it", "day of the year")
- [ ] Google Search Console — `metadata.verification.google` hook + submit sitemap (needs verification code from user)
- [ ] (Optional) Dynamic year in `<title>` for freshness/query match
- [ ] (Optional) Unit tests for `src/lib/time.ts`
- [ ] (Optional) Light/dark mode toggle

## Deployment notes

- Host: Vercel. Domain `yearleft.app` registered at Cloudflare, connected to Vercel; SSL auto-provisioned.
- `NEXT_PUBLIC_SITE_URL=https://yearleft.app` set in Vercel env; code also falls back to it in `src/lib/site.ts`.
- Node pinned to `24.x` via `engines` in `package.json` + `.nvmrc` (Vercel retired 18.x).
- Verified live: `/robots.txt`, `/sitemap.xml`, canonical tag, full OG + Twitter meta. Only gap: no `og:image` yet (preview is text-only until OG image is added).

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
| 2026-05-31 | Domain `yearleft.app` via Cloudflare Registrar; `.app` TLD | Short, brandable, global reach; `.app` forces HTTPS; Cloudflare at-cost renewals |
| 2026-06-04 | All date-derived UI renders on the client from device time (not server/build) | Static prerender froze dates to build time; users span timezones, so device clock is the only correct source |

## Log

| Date | Summary |
| --- | --- |
| 2026-06-04 | **Fixed stale-date bug:** date/day/week/quote/year were Server Components, so `DateTime.now()` froze to build time (showed deploy date, not today). Moved all date-derived UI to the client via new `useNow` hook (`src/hooks/use-now.ts`) and `CurrentYear` component. Converted `year-context-panel` + `motivation-quote` to client components with loading skeletons; `site-header`/`site-footer` now use `<CurrentYear />`. Site always follows device time now. |
| 2026-05-31 | **Deployed to production at https://yearleft.app.** Pinned Node `24.x` (`package.json` engines + `.nvmrc`, bumped `@types/node` to 24) to fix Vercel build failure on retired Node 18. Connected Cloudflare domain to Vercel; set `NEXT_PUBLIC_SITE_URL`. Verified live robots.txt, sitemap.xml, canonical, and OG/Twitter meta tags. OG image still pending. Logged SEO-enrichment backlog for next session. |
| 2026-05-31 | Chose domain `yearleft.app` (Cloudflare Registrar). Set as default fallback in `src/lib/site.ts` and `.env.example`. Added subtle color accents to date/day/week badges and days-remaining highlight (`badge.tsx`, `year-context-panel.tsx`). Hardened `.gitignore` for env/secret files. |
| 2026-05-27 | **Full revamp:** Upgraded to Next.js 15 / React 19 / TypeScript strict. Added shadcn/ui (Card, Badge, Separator), Geist fonts, dark minimalist layout. Extracted `lib/time`, `lib/quotes`, `lib/site`. Replaced legacy components with `CountdownTimer`, `YearContextPanel`, `MotivationQuote`, `SiteHeader`, `SiteFooter`. SEO: Metadata API, OG/Twitter, JSON-LD, sitemap, robots. Added README, `.env.example`, `docs/TECHNICAL_IMPLEMENTATION_PLAN.md`. Removed `@next/font`, old `src/app/components/*`. |
