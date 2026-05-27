export const siteConfig = {
  name: 'Time Remaining',
  title: 'Time Remaining — Countdown to New Year',
  description:
    'Live countdown to the end of the year with day-of-year context, week number, and a daily motivation quote. Make the time you have left count.',
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'https://time-remaining.vercel.app',
  author: 'evkwan',
} as const;
