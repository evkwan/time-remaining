import { Suspense } from 'react';

import { CountdownTimer } from '@/components/countdown-timer';
import { MotivationQuote } from '@/components/motivation-quote';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { YearContextPanel } from '@/components/year-context-panel';

function CountdownFallback() {
  return (
    <div
      className="flex h-[7.5rem] w-full max-w-3xl items-center justify-center rounded-xl border border-border/60 bg-card/80 text-sm text-muted-foreground"
      aria-hidden
    >
      Loading countdown…
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-12 sm:px-6 sm:py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/40 via-background to-background"
      />

      <div className="flex w-full max-w-3xl flex-1 flex-col items-center gap-10 sm:gap-12 md:gap-14">
        <SiteHeader />

        <Suspense fallback={<CountdownFallback />}>
          <CountdownTimer />
        </Suspense>

        <YearContextPanel />

        <MotivationQuote />
      </div>

      <div className="mt-16 w-full">
        <SiteFooter />
      </div>
    </main>
  );
}
