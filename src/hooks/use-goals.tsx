'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DateTime } from 'luxon';

import { localStorageGoalsRepository } from '@/lib/goals/local-storage-repository';
import type { Goal, GoalInput } from '@/lib/goals/types';

interface GoalFormState {
  isOpen: boolean;
  editingGoalId: string | null;
}

interface GoalsContextValue {
  goals: Goal[];
  active: Goal[];
  completed: Goal[];
  archived: Goal[];
  /** False during SSR and until the first client effect reads storage. */
  isHydrated: boolean;
  add: (input: GoalInput) => void;
  update: (id: string, changes: Partial<GoalInput>) => void;
  remove: (id: string) => void;
  complete: (id: string) => void;
  archive: (id: string) => void;
  reactivate: (id: string) => void;
  importGoals: (goals: Goal[]) => void;
  // Dialog state for the shared create/edit modal.
  formState: GoalFormState;
  editingGoal: Goal | null;
  openGoalForm: (goalId?: string) => void;
  closeGoalForm: () => void;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

const repository = localStorageGoalsRepository;

function nowIso(): string {
  return DateTime.now().toISO() ?? new Date().toISOString();
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [formState, setFormState] = useState<GoalFormState>({
    isOpen: false,
    editingGoalId: null,
  });

  // localStorage only exists on the client, so load after mount to keep the
  // server-rendered HTML stable (mirrors the useNow pattern).
  useEffect(() => {
    setGoals(repository.list());
    setIsHydrated(true);
  }, []);

  const refresh = useCallback(() => {
    setGoals(repository.list());
  }, []);

  const add = useCallback(
    (input: GoalInput) => {
      repository.create(input);
      refresh();
    },
    [refresh],
  );

  const update = useCallback(
    (id: string, changes: Partial<GoalInput>) => {
      repository.update(id, changes);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (id: string) => {
      repository.remove(id);
      refresh();
    },
    [refresh],
  );

  const complete = useCallback(
    (id: string) => {
      repository.update(id, { status: 'completed', completedAt: nowIso() });
      refresh();
    },
    [refresh],
  );

  const archive = useCallback(
    (id: string) => {
      repository.update(id, { status: 'archived' });
      refresh();
    },
    [refresh],
  );

  const reactivate = useCallback(
    (id: string) => {
      repository.update(id, { status: 'active', completedAt: undefined });
      refresh();
    },
    [refresh],
  );

  const importGoals = useCallback(
    (next: Goal[]) => {
      repository.replaceAll(next);
      refresh();
    },
    [refresh],
  );

  const openGoalForm = useCallback((goalId?: string) => {
    setFormState({ isOpen: true, editingGoalId: goalId ?? null });
  }, []);

  const closeGoalForm = useCallback(() => {
    setFormState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const active = useMemo(
    () =>
      goals
        .filter((goal) => goal.status === 'active')
        .sort((a, b) => a.targetDate.localeCompare(b.targetDate)),
    [goals],
  );

  const completed = useMemo(
    () =>
      goals
        .filter((goal) => goal.status === 'completed')
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')),
    [goals],
  );

  const archived = useMemo(
    () =>
      goals
        .filter((goal) => goal.status === 'archived')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [goals],
  );

  const editingGoal = useMemo(
    () => goals.find((goal) => goal.id === formState.editingGoalId) ?? null,
    [goals, formState.editingGoalId],
  );

  const value = useMemo<GoalsContextValue>(
    () => ({
      goals,
      active,
      completed,
      archived,
      isHydrated,
      add,
      update,
      remove,
      complete,
      archive,
      reactivate,
      importGoals,
      formState,
      editingGoal,
      openGoalForm,
      closeGoalForm,
    }),
    [
      goals,
      active,
      completed,
      archived,
      isHydrated,
      add,
      update,
      remove,
      complete,
      archive,
      reactivate,
      importGoals,
      formState,
      editingGoal,
      openGoalForm,
      closeGoalForm,
    ],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals(): GoalsContextValue {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
