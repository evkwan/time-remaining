'use client';

import { useRef } from 'react';
import { DateTime } from 'luxon';
import {
  Archive,
  Check,
  Download,
  Pencil,
  RotateCcw,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react';

import { GoalCategoryIcon } from '@/components/goals/goal-category';
import { Button } from '@/components/ui/button';
import { useGoals } from '@/hooks/use-goals';
import { useNow } from '@/hooks/use-now';
import { getGoalProgress } from '@/lib/goals/progress';
import type { Goal } from '@/lib/goals/types';
import { cn } from '@/lib/utils';

function formatDue(targetDate: string): string {
  const date = DateTime.fromISO(targetDate);
  return date.isValid ? date.toFormat('LLL d, yyyy') : '';
}

function formatCompleted(completedAt?: string): string {
  if (!completedAt) return '';
  const date = DateTime.fromISO(completedAt);
  return date.isValid ? date.toFormat('LLL d, yyyy') : '';
}

function ActiveRow({ goal }: { goal: Goal }) {
  const { openGoalForm, complete, remove } = useGoals();
  const now = useNow(60_000);
  const progress = getGoalProgress(goal, now ?? DateTime.now());

  const barClass = progress.isOverdue
    ? 'from-rose-500 to-rose-400'
    : progress.slipsPastYearEnd
      ? 'from-amber-400 to-rose-500'
      : 'from-sky-400 to-emerald-400';

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/70 text-amber-400">
            <GoalCategoryIcon category={goal.category} className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{goal.title}</h3>
            {goal.description ? (
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {goal.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
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
          <button
            type="button"
            onClick={() => remove(goal.id)}
            aria-label="Delete goal"
            title="Delete goal"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-[0.15em] text-sky-300">
            {progress.percentElapsed}% elapsed
          </span>
          <span className="text-muted-foreground">
            {progress.isOverdue
              ? `Overdue · Due ${formatDue(goal.targetDate)}`
              : `${progress.daysRemaining} days · Due ${formatDue(goal.targetDate)}`}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn('h-full rounded-full bg-gradient-to-r', barClass)}
            style={{ width: `${progress.percentElapsed}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function CompletedRow({ goal }: { goal: Goal }) {
  const { archive, remove } = useGoals();
  return (
    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
      <Check className="h-5 w-5 shrink-0 text-emerald-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{goal.title}</p>
        <p className="text-xs text-muted-foreground">
          Completed on {formatCompleted(goal.completedAt)}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => archive(goal.id)}
      >
        <Archive className="h-3.5 w-3.5" />
        Archive
      </Button>
      <button
        type="button"
        onClick={() => remove(goal.id)}
        aria-label="Delete goal"
        title="Delete goal"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function ArchivedRow({ goal }: { goal: Goal }) {
  const { reactivate, remove } = useGoals();
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-3 opacity-80">
      <Archive className="h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{goal.title}</p>
        <p className="text-xs text-muted-foreground">Archived</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => reactivate(goal.id)}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Restore
      </Button>
      <button
        type="button"
        onClick={() => remove(goal.id)}
        aria-label="Delete goal"
        title="Delete goal"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function GoalManagementView() {
  const { active, completed, archived, goals, isHydrated, importGoals } =
    useGoals();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const payload = JSON.stringify({ version: 1, goals }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `yearleft-goals-${DateTime.now().toFormat('yyyy-LL-dd')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const incoming = Array.isArray(parsed)
        ? parsed
        : (parsed as { goals?: unknown }).goals;
      if (Array.isArray(incoming)) {
        importGoals(incoming as Goal[]);
      }
    } catch {
      // Ignore malformed files — the repository also validates on write.
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Year Left
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Goal Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      {!isHydrated ? (
        <div className="mt-10 space-y-3">
          <div className="h-24 animate-pulse rounded-xl bg-card/40" />
          <div className="h-24 animate-pulse rounded-xl bg-card/40" />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <section className="space-y-3" aria-label="Active goals">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Active ({active.length})
              </h2>
            </div>
            {active.length > 0 ? (
              <div className="space-y-3">
                {active.map((goal) => (
                  <ActiveRow key={goal.id} goal={goal} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No active goals yet. Use “Add Goal” to set your first one.
              </p>
            )}
          </section>

          {completed.length > 0 ? (
            <section className="space-y-3" aria-label="Completed goals">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Completed ({completed.length})
                </h2>
              </div>
              <div className="space-y-2">
                {completed.map((goal) => (
                  <CompletedRow key={goal.id} goal={goal} />
                ))}
              </div>
            </section>
          ) : null}

          {archived.length > 0 ? (
            <section className="space-y-3" aria-label="Archived goals">
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Archived ({archived.length})
                </h2>
              </div>
              <div className="space-y-2">
                {archived.map((goal) => (
                  <ArchivedRow key={goal.id} goal={goal} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </main>
  );
}
