import { DateTime } from 'luxon';

import type { GoalsRepository } from './repository';
import type { Goal, GoalCategory, GoalInput, GoalStatus } from './types';
import { GOAL_CATEGORIES } from './types';

const STORAGE_KEY = 'yearleft.goals.v1';
const SCHEMA_VERSION = 1;

interface StoredPayload {
  version: number;
  goals: Goal[];
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `goal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const VALID_STATUSES: GoalStatus[] = ['active', 'completed', 'archived'];

function isGoal(value: unknown): value is Goal {
  if (!value || typeof value !== 'object') return false;
  const goal = value as Record<string, unknown>;
  return (
    typeof goal.id === 'string' &&
    typeof goal.title === 'string' &&
    typeof goal.targetDate === 'string' &&
    typeof goal.createdAt === 'string' &&
    typeof goal.status === 'string' &&
    VALID_STATUSES.includes(goal.status as GoalStatus)
  );
}

function normalizeCategory(value: unknown): GoalCategory {
  return GOAL_CATEGORIES.includes(value as GoalCategory)
    ? (value as GoalCategory)
    : 'other';
}

function normalizeGoal(goal: Goal): Goal {
  return { ...goal, category: normalizeCategory(goal.category) };
}

/**
 * Persists goals to the browser's `localStorage` under a single, versioned key.
 *
 * All access is guarded so it is safe to instantiate during SSR (every method
 * no-ops when `window` is unavailable); read with care from inside effects.
 */
export class LocalStorageGoalsRepository implements GoalsRepository {
  private hasStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private read(): Goal[] {
    if (!this.hasStorage()) return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Partial<StoredPayload>;
      if (!parsed || !Array.isArray(parsed.goals)) return [];
      return parsed.goals.filter(isGoal).map(normalizeGoal);
    } catch {
      return [];
    }
  }

  private write(goals: Goal[]): void {
    if (!this.hasStorage()) return;
    try {
      const payload: StoredPayload = { version: SCHEMA_VERSION, goals };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage full or unavailable (e.g. private browsing) — fail silently.
    }
  }

  list(): Goal[] {
    return this.read();
  }

  create(input: GoalInput): Goal {
    const goal: Goal = {
      id: createId(),
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      category: normalizeCategory(input.category),
      targetDate: input.targetDate,
      createdAt: DateTime.now().toISO() ?? new Date().toISOString(),
      status: 'active',
    };
    this.write([...this.read(), goal]);
    return goal;
  }

  update(
    id: string,
    changes: Partial<Omit<Goal, 'id' | 'createdAt'>>,
  ): Goal | null {
    const goals = this.read();
    const index = goals.findIndex((goal) => goal.id === id);
    if (index === -1) return null;

    const updated: Goal = normalizeGoal({ ...goals[index], ...changes });
    goals[index] = updated;
    this.write(goals);
    return updated;
  }

  remove(id: string): void {
    this.write(this.read().filter((goal) => goal.id !== id));
  }

  replaceAll(goals: Goal[]): void {
    this.write(goals.filter(isGoal).map(normalizeGoal));
  }
}

export const localStorageGoalsRepository = new LocalStorageGoalsRepository();
