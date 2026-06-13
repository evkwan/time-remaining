import type { Goal, GoalInput } from './types';

/**
 * Storage-agnostic contract for persisting goals.
 *
 * Phase 1 ships `LocalStorageGoalsRepository`. Phase 2 can drop in a
 * `SupabaseGoalsRepository` implementing the same interface without touching
 * the React layer or components.
 */
export interface GoalsRepository {
  list(): Goal[];
  create(input: GoalInput): Goal;
  update(
    id: string,
    changes: Partial<Omit<Goal, 'id' | 'createdAt'>>,
  ): Goal | null;
  remove(id: string): void;
  /** Replaces the entire goal set (used by JSON import). */
  replaceAll(goals: Goal[]): void;
}
