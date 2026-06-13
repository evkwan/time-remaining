# Project state

Handoff file for AI and human contributors. Update after meaningful work per `.cursor/rules/project-state-handoff.mdc`.

## Current phase

**Goals web app (Phase 1) built on top of the live countdown.** Users can create/edit/delete annual goals stored in browser `localStorage` behind a swappable repository; dashboard shows active goals as time-based countdowns plus an achievements section; a `/goals` management page handles active/completed/archived plus JSON export/import. SEO-critical countdown content remains server-rendered and unchanged. Site still live at https://yearleft.app.

Next focus: SEO enrichment (OG image, favicon, manifest, crawlable content, Search Console) and Phase 2 persistence (Supabase Auth + Google, anonymous→authenticated migration).

## Next up

### Goals app — Phase 2 (persistence)

- [ ] `SupabaseGoalsRepository` implementing `GoalsRepository` (Supabase already in MCP config)
- [ ] Supabase Auth with Google OAuth; info icon on dashboard ("sign in to sync across devices")
- [ ] Anonymous→authenticated migration (push local goals to the account on first sign-in)
- [ ] (Optional) per-goal reminders/notifications, streaks, "carry over to next year"

### SEO enrichment

- [ ] `opengraph-image.tsx` — branded 1200×630 dynamic OG image (fills blank link preview; biggest CTR win)
- [x] Favicon — `src/app/icon.png` (1024×1024, user-supplied)
- [x] `apple-icon.png` — Apple touch icon (180×180) for iOS "Add to Home Screen"
- [x] `manifest.ts` — PWA manifest (name/desc from `siteConfig`, 192/512 icons in `public/`, standalone, `#0a0a0a`)
- [ ] Crawlable About/FAQ section targeting real queries ("how many days left in the year", "what week of the year is it", "day of the year")
- [ ] Google Search Console — `metadata.verification.google` hook + submit sitemap (needs verification code from user)
- [ ] (Optional) Dynamic year in `<title>` for freshness/query match
- [ ] (Optional) Unit tests for `src/lib/time.ts`
- [ ] (Optional) Light/dark mode toggle

## Deployment notes

- Host: Vercel. Domain `yearleft.app` registered at Cloudflare, connected to Vercel; SSL auto-provisioned.
- Canonical host is `https://www.yearleft.app` (apex 307-redirects to `www`). `src/lib/site.ts` fallback + `.env.example` use `www`. **Action required:** update `NEXT_PUBLIC_SITE_URL` in Vercel from `https://yearleft.app` → `https://www.yearleft.app` and redeploy, otherwise the env var overrides the code and canonical/OG/sitemap still emit the apex.
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
| 2026-06-13 | Goals stored in `localStorage` behind a `GoalsRepository` interface | Zero-friction MVP, no backend/auth; the interface makes the Phase 2 Supabase swap a one-file change |
| 2026-06-13 | Goals have NO completion-progress; the bar is a time-left countdown (depletes from creation to deadline), computed not stored | Goal completion can't be meaningfully measured; a depleting time-left bar is honest and on-brand with "time remaining" |
| 2026-06-13 | `GoalsProvider`/`useGoals()` is the single source of truth; hydrates from storage after mount | Keeps server HTML static (SEO-safe), avoids hydration mismatch (mirrors `useNow`), syncs all views |
| 2026-06-13 | `/goals` management page is `noindex`; `/` stays the indexed SEO landing | Personal app surface shouldn't compete with the ranking countdown page |
| 2026-06-13 | Goals reset annually (no rollover); overdue goals stay active + flagged; Phase 2 sign-in stays optional/local-first | Confirmed product decisions; each year is a clean slate, sign-in is opt-in sync not a gate (see `docs/PROJECT_SPEC.md` §11) |
| 2026-06-14 | Brand standardized on **Year Left** in metadata (`siteConfig.name`/`title`); SEO title leads with the evergreen "days left in the year" intent | Metadata still said "Time Remaining" while nav/domain/spec all said Year Left — aligning removes brand dilution and targets a year-round query over seasonal "Countdown to New Year" |

## Log

| Date | Summary |
| --- | --- |
| 2026-06-14 | **Applied brand gradient to hero + text accents.** Hero `<h1>` "Time remaining" now uses `.text-brand-gradient`; converted the prominent sky-only text accents to gradient too: "Time Remaining"/"Time Left" eyebrows (`goal-card`, `goal-management-view`) and the "Estimated Runway" label (`goal-form-dialog`). Active nav-link underline changed from `border-sky-400` to a 2px `bg-brand-gradient` underline (`bg-[length:100%_2px] bg-bottom bg-no-repeat`). Intentionally left small translucent interactive tints on the sky anchor (category-picker selected state, empty-state hover, `badge` sky variant, the year-progress bar's sky→emerald→amber journey) — gradients render muddy as semi-transparent borders/fills. Lint + build green. |
| 2026-06-14 | **Brand gradient as a shared theme token.** Made the sky→emerald cyan-green gradient the app's accent theme. Added `--brand-gradient-from`/`--brand-gradient-to` CSS vars (`globals.css`), a `bg-brand-gradient` utility (`tailwind.config.ts` `backgroundImage`), and a `.text-brand-gradient` helper (gradient text). Refactored all hardcoded `from-sky-400 to-emerald-400` usages to it: nav "Add Goal" button (now gradient + dark text + `hover:brightness-110`), the goal-form runway preview, and both goal time-left bars (healthy state → `bg-brand-gradient`; overdue/soon keep their rose/amber gradients). One place to change the brand colors now. Typecheck/lint/build green. |
| 2026-06-14 | **Canonical host → www.** Prod redirects apex → `www.yearleft.app`, but canonical/OG/sitemap/robots emitted the apex (one redirect hop for crawlers). Changed `siteConfig.url` fallback and `.env.example` to `https://www.yearleft.app` (everything derives from `siteConfig.url`). Still needs the Vercel `NEXT_PUBLIC_SITE_URL` env var updated to `www` (no MCP tool for env vars) — it overrides the code fallback in prod. |
| 2026-06-14 | **Fixed tab favicon + header logo.** The browser tab kept showing the old default icon because the create-next-app `src/app/favicon.ico` (May 27) was still git-tracked — Next auto-emits `<link rel="icon" href="/favicon.ico" sizes="16x16">` whenever it exists, and browsers prefer `favicon.ico` over `icon.png`. Deleted it so `src/app/icon.png` is the sole favicon. Also swapped the nav logo from the lucide `Hourglass` to the uploaded brand icon via `next/image` (`/icon-192.png`, 24×24, rounded) in `app-nav.tsx`. Typecheck + app-nav tests green. (Note: prod redirects apex → `www.yearleft.app`, but `siteConfig.url`/canonical use the apex — possible future canonical cleanup.) |
| 2026-06-14 | **Favicon, Apple icon + PWA manifest.** User supplied `src/app/icon.png` (1024×1024, no alpha; replaced the interim hourglass `icon.svg`). Generated `src/app/apple-icon.png` (180×180) for iOS home screen and `public/icon-192.png` / `public/icon-512.png` for the manifest. Added `src/app/manifest.ts` (`MetadataRoute.Manifest`): name/description from `siteConfig`, `start_url: /`, `display: standalone`, `#0a0a0a` theme/background, 192+512 icons. Typecheck green. |
| 2026-06-14 | **Favicon + SEO title/brand fix.** Added `src/app/icon.svg` (sky-blue hourglass matching the nav logo) as the site favicon — none existed before (only an unused `public/vercel.svg`). Standardized brand metadata on **Year Left** in `src/lib/site.ts` (was "Time Remaining" despite nav/domain/spec all saying Year Left): `name` → `Year Left`, `title` → `How Many Days Are Left in the Year? — Year Left` (evergreen "days left in the year" intent over seasonal "Countdown to New Year"). Cascades to the `<title>` template, OG/Twitter meta, and JSON-LD `name`. Updated README H1. Left concept labels "Time remaining" in `site-header.tsx`/`goal-card.tsx` intentionally (not brand names). |
| 2026-06-13 | **Added test suite (Vitest + RTL + jsdom).** Stood up testing infra: `vitest.config.ts` (jsdom, globals, native `resolve.tsconfigPaths`), `src/test/setup.ts` (jest-dom matchers, cleanup, clears `localStorage`), `src/test/goals.ts` (mock `useGoals` factory), and `test`/`test:watch` scripts. 53 tests across 9 files: `countdown` (time-left math), `local-storage-repository` (CRUD, versioning, validation, corrupt-JSON/quota recovery), `useGoals` (hydration, mutations, selector sorting, dialog state, import, provider guard), and components (`goal-card`, `active-goals-section`, `achievements-section`, `goal-form-dialog`, `app-nav`, `goal-management-view` incl. export/import). All green; typecheck/lint/build still pass. |
| 2026-06-13 | **Fixed goal bar semantics.** Goals never had measurable completion progress; the bar was filling with *elapsed* time (grew toward the deadline), implying fake progress. Reframed as a **time-left countdown**: renamed `src/lib/goals/progress.ts` → `countdown.ts` (`getGoalProgress`/`percentElapsed` → `getGoalCountdown`/`percentTimeLeft`, now depletes from creation to deadline). Updated `goal-card.tsx` and `goal-management-view.tsx` (dropped "% elapsed" label; shows "Time Left"/"Overdue" + days). Updated spec §4.2/§4.4/§6 and the locked decision. Typecheck + lint green. |
| 2026-06-13 | **Added product spec.** Created `docs/PROJECT_SPEC.md` capturing the current product (overview, goals/non-goals, users, features, data model, architecture, routes, stack, SEO/privacy posture, roadmap, open questions) as the single source of truth for what the app is post-Phase-1. |
| 2026-06-13 | **Goals web app (Phase 1).** Turned the static countdown into a goal tracker. Added storage layer (`src/lib/goals/`: `types`, `repository` interface, `LocalStorageGoalsRepository` with versioned payload + validation, `progress.ts` time math). Added `GoalsProvider`/`useGoals()` (`src/hooks/use-goals.tsx`) with SSR-safe hydration + shared create/edit dialog state. Added shadcn `button/dialog/input/textarea/label`. New components under `src/components/goals/` (goal-card, active-goals-section, achievements-section, goal-form-dialog, empty-state/create-tile, goal-management-view, goal-category) plus `app-nav` and `app-shell`. Dashboard (`/`) now: nav + countdown (unchanged) + My Active Goals + achievements; new `/goals` management page (active/completed/archived, archive/restore/delete, JSON export/import, `noindex`). Wrapped app in `AppShell` (provider + nav + dialog + footer) via root layout. Typecheck/lint/build all green; both routes still statically prerendered. |
| 2026-06-04 | **Fixed stale-date bug:** date/day/week/quote/year were Server Components, so `DateTime.now()` froze to build time (showed deploy date, not today). Moved all date-derived UI to the client via new `useNow` hook (`src/hooks/use-now.ts`) and `CurrentYear` component. Converted `year-context-panel` + `motivation-quote` to client components with loading skeletons; `site-header`/`site-footer` now use `<CurrentYear />`. Site always follows device time now. |
| 2026-05-31 | **Deployed to production at https://yearleft.app.** Pinned Node `24.x` (`package.json` engines + `.nvmrc`, bumped `@types/node` to 24) to fix Vercel build failure on retired Node 18. Connected Cloudflare domain to Vercel; set `NEXT_PUBLIC_SITE_URL`. Verified live robots.txt, sitemap.xml, canonical, and OG/Twitter meta tags. OG image still pending. Logged SEO-enrichment backlog for next session. |
| 2026-05-31 | Chose domain `yearleft.app` (Cloudflare Registrar). Set as default fallback in `src/lib/site.ts` and `.env.example`. Added subtle color accents to date/day/week badges and days-remaining highlight (`badge.tsx`, `year-context-panel.tsx`). Hardened `.gitignore` for env/secret files. |
| 2026-05-27 | **Full revamp:** Upgraded to Next.js 15 / React 19 / TypeScript strict. Added shadcn/ui (Card, Badge, Separator), Geist fonts, dark minimalist layout. Extracted `lib/time`, `lib/quotes`, `lib/site`. Replaced legacy components with `CountdownTimer`, `YearContextPanel`, `MotivationQuote`, `SiteHeader`, `SiteFooter`. SEO: Metadata API, OG/Twitter, JSON-LD, sitemap, robots. Added README, `.env.example`, `docs/TECHNICAL_IMPLEMENTATION_PLAN.md`. Removed `@next/font`, old `src/app/components/*`. |
