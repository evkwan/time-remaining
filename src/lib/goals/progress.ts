import { DateTime } from 'luxon';

import { getEndOfYear } from '@/lib/time';
import type { Goal } from './types';

export interface GoalProgress {
  /** Time elapsed from creation toward the target date, 0-100. */
  percentElapsed: number;
  /** Whole days remaining until the target date (never negative). */
  daysRemaining: number;
  /** Total span of the goal in days (creation to target). */
  daysTotal: number;
  isOverdue: boolean;
  /** True when the deadline falls after December 31 of the current year. */
  slipsPastYearEnd: boolean;
}

/**
 * Derives time-based progress for a goal. Progress is never stored — it is
 * always computed from `createdAt` and `targetDate` relative to `now`.
 */
export function getGoalProgress(
  goal: Goal,
  now: DateTime = DateTime.now(),
): GoalProgress {
  const created = DateTime.fromISO(goal.createdAt);
  const target = DateTime.fromISO(goal.targetDate).endOf('day');

  const totalMs = target.toMillis() - created.toMillis();
  const elapsedMs = now.toMillis() - created.toMillis();

  const percentElapsed =
    totalMs <= 0
      ? 100
      : Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));

  const remainingDays = target.diff(now, 'days').days;
  const daysRemaining = Math.max(0, Math.ceil(remainingDays));
  const daysTotal = Math.max(0, Math.ceil(target.diff(created, 'days').days));

  return {
    percentElapsed,
    daysRemaining,
    daysTotal,
    isOverdue: now > target,
    slipsPastYearEnd: target > getEndOfYear(now),
  };
}
