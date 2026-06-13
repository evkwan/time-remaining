import { vi } from 'vitest';

import type { Goal } from '@/lib/goals/types';

export function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'goal-1',
    title: 'Run a marathon',
    description: 'Berlin International Race',
    category: 'target',
    createdAt: '2026-01-01T00:00:00.000Z',
    targetDate: '2026-10-12',
    status: 'active',
    ...overrides,
  };
}

/**
 * Builds a fully-populated mock of the `useGoals()` return value with vi.fn()
 * spies for every action, so component tests can isolate from the provider.
 */
export function makeGoalsContext(overrides: Record<string, unknown> = {}) {
  return {
    goals: [],
    active: [],
    completed: [],
    archived: [],
    isHydrated: true,
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    complete: vi.fn(),
    archive: vi.fn(),
    reactivate: vi.fn(),
    importGoals: vi.fn(),
    formState: { isOpen: false, editingGoalId: null },
    editingGoal: null,
    openGoalForm: vi.fn(),
    closeGoalForm: vi.fn(),
    ...overrides,
  };
}
