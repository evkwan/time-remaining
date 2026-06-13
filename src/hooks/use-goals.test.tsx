import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';

import { GoalsProvider, useGoals } from './use-goals';
import { LocalStorageGoalsRepository } from '@/lib/goals/local-storage-repository';
import type { Goal, GoalInput } from '@/lib/goals/types';

function wrapper({ children }: { children: ReactNode }) {
  return <GoalsProvider>{children}</GoalsProvider>;
}

const input: GoalInput = {
  title: 'Launch app',
  category: 'code',
  targetDate: '2026-12-01',
};

function seededGoal(overrides: Partial<Goal>): Goal {
  return {
    id: Math.random().toString(36).slice(2),
    title: 'Seed',
    category: 'target',
    createdAt: '2026-01-01T00:00:00.000Z',
    targetDate: '2026-12-31',
    status: 'active',
    ...overrides,
  };
}

describe('useGoals', () => {
  it('throws when used outside of a GoalsProvider', () => {
    expect(() => renderHook(() => useGoals())).toThrow(
      /must be used within a GoalsProvider/,
    );
  });

  it('hydrates goals from storage after mount', () => {
    new LocalStorageGoalsRepository().create(input);

    const { result } = renderHook(() => useGoals(), { wrapper });

    expect(result.current.isHydrated).toBe(true);
    expect(result.current.goals).toHaveLength(1);
    expect(result.current.active).toHaveLength(1);
  });

  it('adds a new active goal', () => {
    const { result } = renderHook(() => useGoals(), { wrapper });

    act(() => result.current.add(input));

    expect(result.current.active).toHaveLength(1);
    expect(result.current.active[0].title).toBe('Launch app');
  });

  it('completes, archives and reactivates a goal', () => {
    const { result } = renderHook(() => useGoals(), { wrapper });
    act(() => result.current.add(input));
    const id = result.current.active[0].id;

    act(() => result.current.complete(id));
    expect(result.current.completed).toHaveLength(1);
    expect(result.current.completed[0].completedAt).toBeTruthy();

    act(() => result.current.archive(id));
    expect(result.current.archived).toHaveLength(1);
    expect(result.current.completed).toHaveLength(0);

    act(() => result.current.reactivate(id));
    expect(result.current.active).toHaveLength(1);
    expect(result.current.active[0].completedAt).toBeUndefined();
  });

  it('sorts active goals by target date ascending', () => {
    const { result } = renderHook(() => useGoals(), { wrapper });
    act(() =>
      result.current.importGoals([
        seededGoal({ title: 'Later', targetDate: '2026-11-01' }),
        seededGoal({ title: 'Sooner', targetDate: '2026-03-01' }),
      ]),
    );

    expect(result.current.active.map((g) => g.title)).toEqual([
      'Sooner',
      'Later',
    ]);
  });

  it('sorts completed goals by completion date descending', () => {
    const { result } = renderHook(() => useGoals(), { wrapper });
    act(() =>
      result.current.importGoals([
        seededGoal({
          title: 'Older win',
          status: 'completed',
          completedAt: '2026-02-01T00:00:00.000Z',
        }),
        seededGoal({
          title: 'Recent win',
          status: 'completed',
          completedAt: '2026-05-01T00:00:00.000Z',
        }),
      ]),
    );

    expect(result.current.completed.map((g) => g.title)).toEqual([
      'Recent win',
      'Older win',
    ]);
  });

  it('manages create/edit dialog state', () => {
    const { result } = renderHook(() => useGoals(), { wrapper });
    act(() => result.current.add(input));
    const id = result.current.active[0].id;

    act(() => result.current.openGoalForm());
    expect(result.current.formState.isOpen).toBe(true);
    expect(result.current.editingGoal).toBeNull();

    act(() => result.current.openGoalForm(id));
    expect(result.current.formState.isOpen).toBe(true);
    expect(result.current.editingGoal?.id).toBe(id);

    act(() => result.current.closeGoalForm());
    expect(result.current.formState.isOpen).toBe(false);
  });

  it('imports goals, replacing the current set', () => {
    const { result } = renderHook(() => useGoals(), { wrapper });
    act(() => result.current.add(input));

    act(() =>
      result.current.importGoals([
        seededGoal({ title: 'Imported A' }),
        seededGoal({ title: 'Imported B' }),
      ]),
    );

    expect(result.current.goals).toHaveLength(2);
    expect(result.current.goals.map((g) => g.title).sort()).toEqual([
      'Imported A',
      'Imported B',
    ]);
  });
});
