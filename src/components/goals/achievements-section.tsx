'use client';

import { DateTime } from 'luxon';
import { CheckCircle2, PartyPopper } from 'lucide-react';

import { useGoals } from '@/hooks/use-goals';

function formatCompletedDate(completedAt?: string): string {
  if (!completedAt) return '';
  const date = DateTime.fromISO(completedAt);
  return date.isValid ? date.toFormat('LLL dd').toUpperCase() : '';
}

export function AchievementsSection() {
  const { completed, isHydrated } = useGoals();

  if (!isHydrated || completed.length === 0) return null;

  return (
    <section className="w-full space-y-4" aria-label="Achievements">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          What you achieved this year
        </h2>
        <p className="text-sm text-muted-foreground">
          Victory lap: you&apos;ve mastered these priorities.
        </p>
      </div>

      <ul className="space-y-2">
        {completed.map((goal) => (
          <li
            key={goal.id}
            className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{goal.title}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Completed {formatCompletedDate(goal.completedAt)}
              </p>
            </div>
            <PartyPopper className="h-4 w-4 shrink-0 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </section>
  );
}
