import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';

import { getGoalCountdown } from './countdown';
import type { Goal } from './types';

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'g1',
    title: 'Test goal',
    category: 'target',
    createdAt: '2026-01-01T00:00:00.000+00:00',
    targetDate: '2026-12-31',
    status: 'active',
    ...overrides,
  };
}

describe('getGoalCountdown', () => {
  it('reports roughly half the time left at the midpoint of the window', () => {
    const created = DateTime.local(2026, 6, 1, 0, 0, 0);
    const goal = makeGoal({
      createdAt: created.toISO()!,
      targetDate: '2026-07-31', // ~60 day window
    });
    const now = created.plus({ days: 30 });

    const result = getGoalCountdown(goal, now);

    expect(result.percentTimeLeft).toBeGreaterThanOrEqual(48);
    expect(result.percentTimeLeft).toBeLessThanOrEqual(52);
    expect(result.isOverdue).toBe(false);
  });

  it('starts full (100%) when now is at/just after creation', () => {
    const created = DateTime.local(2026, 6, 1, 0, 0, 0);
    const goal = makeGoal({ createdAt: created.toISO()!, targetDate: '2026-09-01' });

    const result = getGoalCountdown(goal, created);

    expect(result.percentTimeLeft).toBe(100);
  });

  it('clamps to 100% if now is before creation (clock skew)', () => {
    const created = DateTime.local(2026, 6, 1, 0, 0, 0);
    const goal = makeGoal({ createdAt: created.toISO()!, targetDate: '2026-09-01' });

    const result = getGoalCountdown(goal, created.minus({ days: 5 }));

    expect(result.percentTimeLeft).toBe(100);
  });

  it('is empty (0%) and overdue once now passes the deadline', () => {
    const goal = makeGoal({
      createdAt: DateTime.local(2026, 1, 1).toISO()!,
      targetDate: '2026-06-01',
    });
    const now = DateTime.local(2026, 6, 2, 12, 0, 0);

    const result = getGoalCountdown(goal, now);

    expect(result.percentTimeLeft).toBe(0);
    expect(result.isOverdue).toBe(true);
    expect(result.daysRemaining).toBe(0);
  });

  it('never returns a negative daysRemaining', () => {
    const goal = makeGoal({ targetDate: '2026-01-01' });
    const now = DateTime.local(2027, 1, 1);

    expect(getGoalCountdown(goal, now).daysRemaining).toBe(0);
  });

  it('treats the deadline as end-of-day: a goal due today is not overdue at noon', () => {
    const today = DateTime.local(2026, 6, 15, 12, 0, 0);
    const goal = makeGoal({
      createdAt: DateTime.local(2026, 6, 1).toISO()!,
      targetDate: '2026-06-15',
    });

    const result = getGoalCountdown(goal, today);

    expect(result.isOverdue).toBe(false);
    expect(result.daysRemaining).toBeGreaterThanOrEqual(1);
  });

  it('flags deadlines that slip past December 31 of the current year', () => {
    const now = DateTime.local(2026, 6, 1);
    const withinYear = makeGoal({ targetDate: '2026-11-30' });
    const nextYear = makeGoal({ targetDate: '2027-03-01' });

    expect(getGoalCountdown(withinYear, now).slipsPastYearEnd).toBe(false);
    expect(getGoalCountdown(nextYear, now).slipsPastYearEnd).toBe(true);
  });

  it('handles a degenerate window (deadline before creation) without dividing by zero', () => {
    const goal = makeGoal({
      createdAt: DateTime.local(2026, 6, 10).toISO()!,
      targetDate: '2026-06-01',
    });
    const now = DateTime.local(2026, 6, 11);

    const result = getGoalCountdown(goal, now);

    expect(result.percentTimeLeft).toBe(0);
    expect(Number.isNaN(result.percentTimeLeft)).toBe(false);
  });
});
