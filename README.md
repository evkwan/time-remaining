# Time Remaining

A minimalist live countdown to the end of the year — with day-of-year context, week number, year progress, and a daily motivation quote.

Built to create a sense of urgency: the time left in the year is finite, so make it count.

## What it does

- **Live countdown** — Hours, minutes, and seconds (with centiseconds) until December 31 at 23:59:59 local time
- **Year context** — Current date, day of year, week of year, days remaining, and a progress bar
- **Daily quote** — One motivation quote per calendar day (stable across refreshes, no hydration flicker)

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router, React Server Components) |
| Language | TypeScript (strict) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| UI | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives, New York style) |
| Date/time | [Luxon](https://moment.github.io/luxon/) |
| Fonts | [Geist](https://vercel.com/font) via `next/font` |
| Deploy | [Vercel](https://vercel.com/) |

## Project structure

```
src/
├── app/                  # Next.js App Router (layout, page, SEO routes)
├── components/           # UI components (feature + shadcn ui/)
└── lib/                  # Pure utilities (time, quotes, site config)
```

**Architecture notes**

- Server Components by default; only the countdown timer is a Client Component (`useEffect` + interval)
- Date logic lives in `src/lib/time.ts` (testable, no React)
- Quotes are deterministic by day-of-year (SSR-safe)
- SEO: metadata API, Open Graph, Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`

## Getting started

**Requirements:** Node.js 20+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and set your production URL for correct canonical links and sitemap:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Deploy on Vercel

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/new)
2. Set `NEXT_PUBLIC_SITE_URL` to your deployment URL (e.g. `https://time-remaining.vercel.app`)
3. Deploy — no backend or database required

## SEO checklist (implemented)

- [x] Title, description, keywords via Metadata API
- [x] Open Graph and Twitter card metadata
- [x] Canonical URL and `metadataBase`
- [x] `robots.txt` and `sitemap.xml`
- [x] JSON-LD (`WebApplication` schema)
- [x] Semantic HTML (`main`, `header`, `footer`, `blockquote`, progressbar ARIA)
- [ ] OG image — add `opengraph-image.tsx` when you have a branded asset

## License

Private project — © evkwan
