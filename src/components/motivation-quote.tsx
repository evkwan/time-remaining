import { DateTime } from 'luxon';

import { getQuoteForDayOfYear } from '@/lib/quotes';
import { getYearContext } from '@/lib/time';

export function MotivationQuote() {
  const { dayOfYear } = getYearContext(DateTime.now());
  const quote = getQuoteForDayOfYear(dayOfYear);

  return (
    <blockquote className="max-w-lg text-center">
      <p className="text-base italic leading-relaxed text-muted-foreground sm:text-lg">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="mt-3 text-xs uppercase tracking-widest text-muted-foreground/70">
        Daily motivation
      </footer>
    </blockquote>
  );
}
