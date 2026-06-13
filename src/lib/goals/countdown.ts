import { DateTime } from 'luxon';

import { getEndOfYear } from '@/lib/time';
import type { Goal } from './types';

export interface GoalCountdown {
  /**
   * Share of the goal's window that is still left, 0-100. Starts near 100 at
   * creation and depletes to 0 at the deadline. This is a countdown of time
   * remaining, NOT a measure of goal completion (which we can't track).
   */
  percentTimeLeft: number;
  /** Whole days remaining until the target date (never negative). */
  daysRemaining: number;
  /** Total span of the goal in days (creation to target). */
  daysTotal: number;
  isOverdue: boolean;
  /** True when the deadline falls after December 31 of the current year. */
  slipsPastYearEnd: boolean;
}

/**
 * Derives the time-left countdown for a goal. Always computed from `createdAt`
 * and `targetDate` relative to `now`; nothing is stored. The returned
 * `percentTimeLeft` is meant to drive a depleting bar, not a progress bar.
 */
export function getGoalCountdown(
  goal: Goal,
  now: DateTime = DateTime.now(),
): GoalCountdown {
  const created = DateTime.fromISO(goal.createdAt);
  const target = DateTime.fromISO(goal.targetDate).endOf('day');

  const totalMs = target.toMillis() - created.toMillis();
  const remainingMs = target.toMillis() - now.toMillis();

  const percentTimeLeft =
    totalMs <= 0
      ? 0
      : Math.min(100, Math.max(0, Math.round((remainingMs / totalMs) * 100)));

  const daysRemaining = Math.max(0, Math.ceil(target.diff(now, 'days').days));
  const daysTotal = Math.max(0, Math.ceil(target.diff(created, 'days').days));

  return {
    percentTimeLeft,
    daysRemaining,
    daysTotal,
    isOverdue: now > target,
    slipsPastYearEnd: target > getEndOfYear(now),
  };
}
