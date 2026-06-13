'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Timer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GOAL_CATEGORY_META } from '@/components/goals/goal-category';
import { useGoals } from '@/hooks/use-goals';
import { GOAL_CATEGORIES, type GoalCategory } from '@/lib/goals/types';
import { cn } from '@/lib/utils';

function defaultTargetDate(): string {
  return DateTime.now().endOf('year').toFormat('yyyy-MM-dd');
}

function runwayDays(targetDate: string): number {
  if (!targetDate) return 0;
  const target = DateTime.fromISO(targetDate).endOf('day');
  if (!target.isValid) return 0;
  return Math.max(0, Math.ceil(target.diff(DateTime.now(), 'days').days));
}

export function GoalFormDialog() {
  const { formState, editingGoal, closeGoalForm, add, update, remove } =
    useGoals();
  const isEditing = !!editingGoal;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState(defaultTargetDate);
  const [category, setCategory] = useState<GoalCategory>('target');

  useEffect(() => {
    if (!formState.isOpen) return;
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description ?? '');
      setTargetDate(editingGoal.targetDate);
      setCategory(editingGoal.category);
    } else {
      setTitle('');
      setDescription('');
      setTargetDate(defaultTargetDate());
      setCategory('target');
    }
  }, [formState.isOpen, editingGoal]);

  const canSubmit = title.trim().length > 0 && !!targetDate;
  const runway = runwayDays(targetDate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      targetDate,
      category,
    };

    if (isEditing && editingGoal) {
      update(editingGoal.id, payload);
    } else {
      add(payload);
    }
    closeGoalForm();
  };

  const handleDelete = () => {
    if (editingGoal) {
      remove(editingGoal.id);
      closeGoalForm();
    }
  };

  return (
    <Dialog
      open={formState.isOpen}
      onOpenChange={(open) => {
        if (!open) closeGoalForm();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <p className="text-brand-gradient text-xs font-medium uppercase tracking-[0.25em]">
            {isEditing ? 'Refining Intent' : 'Intention Setting'}
          </p>
          <DialogTitle className="text-2xl">
            {isEditing ? 'Edit Goal' : 'New Goal'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? 'Update the details of your goal.'
              : 'Define a goal to hit before the year ends.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="goal-title"
              className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
            >
              Goal Title
            </Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Master Rust Programming"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="goal-description"
              className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="goal-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does success look like?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="goal-target"
                className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
              >
                Target Deadline
              </Label>
              <Input
                id="goal-target"
                type="date"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Visual Category
              </span>
              <div className="flex gap-2">
                {GOAL_CATEGORIES.map((value) => {
                  const { Icon, label } = GOAL_CATEGORY_META[value];
                  const isActive = value === category;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCategory(value)}
                      aria-label={label}
                      aria-pressed={isActive}
                      title={label}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-md border transition-colors',
                        isActive
                          ? 'border-sky-400 bg-sky-500/15 text-sky-300'
                          : 'border-border bg-secondary/60 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <Timer className="h-4 w-4 text-amber-400" />
              <div className="leading-tight">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Estimated Runway
                </p>
                <p className="font-mono text-sm tabular-nums">
                  {runway.toString().padStart(3, '0')} days remaining
                </p>
              </div>
            </div>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-brand-gradient"
                style={{ width: runway > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {isEditing ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              >
                Delete Goal
              </Button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={closeGoalForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {isEditing ? 'Save Changes' : 'Create Goal'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
