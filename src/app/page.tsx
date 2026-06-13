import { Suspense } from 'react';

import { AchievementsSection } from '@/components/goals/achievements-section';
import { ActiveGoalsSection } from '@/components/goals/active-goals-section';
import { CountdownTimer } from '@/components/countdown-timer';
import { MotivationQuote } from '@/components/motivation-quote';
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
    <main className="relative flex flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/40 via-background to-background"
      />

      <div className="flex w-full max-w-5xl flex-col gap-16">
        <div className="flex flex-col items-center gap-10 sm:gap-12">
          <SiteHeader />

          <Suspense fallback={<CountdownFallback />}>
            <CountdownTimer />
          </Suspense>

          <YearContextPanel />
        </div>

        <ActiveGoalsSection />

        <AchievementsSection />

        <div className="flex flex-col items-center">
          <MotivationQuote />
        </div>
      </div>
    </main>
  );
}
