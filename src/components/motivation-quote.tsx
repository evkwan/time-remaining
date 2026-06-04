'use client';

import { useNow } from '@/hooks/use-now';
import { getQuoteForDayOfYear } from '@/lib/quotes';

export function MotivationQuote() {
  const now = useNow();
  const quote = now ? getQuoteForDayOfYear(now.ordinal) : null;

  return (
    <blockquote className="min-h-[3.5rem] max-w-lg text-center">
      <p className="text-base italic leading-relaxed text-muted-foreground sm:text-lg">
        {quote ? <>&ldquo;{quote}&rdquo;</> : '\u00A0'}
      </p>
      <footer className="mt-3 text-xs uppercase tracking-widest text-muted-foreground/70">
        Daily motivation
      </footer>
    </blockquote>
  );
}
