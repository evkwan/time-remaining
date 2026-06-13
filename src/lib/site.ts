export const siteConfig = {
  name: 'Year Left',
  title: 'How Many Days Are Left in the Year? — Year Left',
  description:
    'Live countdown to the end of the year with day-of-year context, week number, and a daily motivation quote. Make the time you have left count.',
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'https://www.yearleft.app',
  author: 'evkwan',
} as const;
