'use client';

import { DateTime } from 'luxon';
import { Check, Pencil } from 'lucide-react';

import { GoalCategoryIcon } from '@/components/goals/goal-category';
import { useGoals } from '@/hooks/use-goals';
import { useNow } from '@/hooks/use-now';
import { getGoalCountdown } from '@/lib/goals/countdown';
import type { Goal } from '@/lib/goals/types';
import { cn } from '@/lib/utils';

function formatTargetDate(targetDate: string): string {
  const date = DateTime.fromISO(targetDate);
  return date.isValid ? date.toFormat('LLL dd').toUpperCase() : '';
}

export function GoalCard({ goal }: { goal: Goal }) {
  const { openGoalForm, complete } = useGoals();
  const now = useNow(60_000);
  const countdown = getGoalCountdown(goal, now ?? DateTime.now());

  const barClass = countdown.isOverdue
    ? 'bg-gradient-to-r from-rose-500 to-rose-400'
    : countdown.slipsPastYearEnd
      ? 'bg-gradient-to-r from-amber-400 to-rose-500'
      : 'bg-brand-gradient';

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-border/70 bg-card/70 p-5 transition-colors hover:border-border">
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/70 text-amber-400">
          <GoalCategoryIcon category={goal.category} className="h-4 w-4" />
        </span>
        <span className="font-mono text-xs tracking-widest text-muted-foreground">
          {formatTargetDate(goal.targetDate)}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold leading-tight">{goal.title}</h3>
        {goal.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {goal.description}
          </p>
        ) : null}
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-brand-gradient font-mono uppercase tracking-[0.18em]">
            {countdown.isOverdue ? 'Overdue' : 'Time Remaining'}
          </span>
          <span className="font-medium text-foreground">
            {countdown.daysRemaining} Days
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              barClass,
            )}
            style={{ width: `${countdown.percentTimeLeft}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <button
          type="button"
          onClick={() => complete(goal.id)}
          aria-label="Mark complete"
          title="Mark complete"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => openGoalForm(goal.id)}
          aria-label="Edit goal"
          title="Edit goal"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
