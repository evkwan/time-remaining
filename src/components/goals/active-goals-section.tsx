'use client';

import { CreateGoalTile } from '@/components/goals/empty-state';
import { GoalCard } from '@/components/goals/goal-card';
import { useGoals } from '@/hooks/use-goals';

function GoalCardSkeleton() {
  return (
    <div className="min-h-[12rem] animate-pulse rounded-xl border border-border/60 bg-card/40" />
  );
}

export function ActiveGoalsSection() {
  const { active, isHydrated } = useGoals();

  return (
    <section className="w-full space-y-4" aria-label="Active goals">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">My Active Goals</h2>
        <p className="text-sm text-muted-foreground">
          Don&apos;t let your priorities slip through time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!isHydrated ? (
          <>
            <GoalCardSkeleton />
            <GoalCardSkeleton />
            <GoalCardSkeleton />
          </>
        ) : (
          <>
            {active.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
            <CreateGoalTile />
          </>
        )}
      </div>
    </section>
  );
}
