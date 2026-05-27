export const MOTIVATION_QUOTES = [
  'Yesterday you said tomorrow.',
  'Time and tide wait for no one.',
  'The time is always right to do what matters.',
  "Time is the world's most expensive currency—you can't earn it back.",
  'Use time wisely—you cannot earn it back.',
  'Go forth and build.',
  'The time is now.',
  "The clock is ticking, and it's ticking fast.",
  'Your future starts with the choices you make today.',
  'The best time to plant a tree was twenty years ago. The second best time is now.',
  'Nothing guarantees results except inaction—it guarantees zero.',
  'Inspiration is perishable. Act on it immediately.',
  'Meaningful results require unglamorous work. Get moving.',
  "It isn't over until it's over. Go for it.",
  'It is never too late to start.',
  'Take action. Take action. Take action.',
  'Your choices today shape your tomorrow.',
  "Seize the present; it's the key to your future.",
  'Delay no more—take the first step today.',
] as const;

/** Deterministic quote for a given calendar day (stable for SSR and hydration). */
export function getQuoteForDayOfYear(dayOfYear: number): string {
  const index = dayOfYear % MOTIVATION_QUOTES.length;
  return MOTIVATION_QUOTES[index] ?? MOTIVATION_QUOTES[0];
}
