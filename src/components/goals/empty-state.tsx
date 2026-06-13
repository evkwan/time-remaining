'use client';

import { Plus } from 'lucide-react';

import { useGoals } from '@/hooks/use-goals';

export function CreateGoalTile() {
  const { openGoalForm } = useGoals();

  return (
    <button
      type="button"
      onClick={() => openGoalForm()}
      className="group flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-card/30 p-5 text-center transition-colors hover:border-sky-400/60 hover:bg-card/60"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors group-hover:bg-sky-500/20 group-hover:text-sky-300">
        <Plus className="h-5 w-5" />
      </span>
      <span className="space-y-1">
        <span className="block text-sm font-medium">Create New Anchor</span>
        <span className="block text-xs text-muted-foreground">
          What matters most right now?
        </span>
      </span>
    </button>
  );
}
