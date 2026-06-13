export type GoalStatus = 'active' | 'completed' | 'archived';

export type GoalCategory = 'target' | 'code' | 'palette' | 'other';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  /** ISO date (yyyy-MM-dd) the goal should be hit by. */
  targetDate: string;
  /** ISO timestamp when the goal was created. */
  createdAt: string;
  status: GoalStatus;
  /** ISO timestamp when the goal was marked complete. */
  completedAt?: string;
}

/** Fields supplied by the user when creating or editing a goal. */
export interface GoalInput {
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate: string;
}

export const GOAL_CATEGORIES: GoalCategory[] = [
  'target',
  'code',
  'palette',
  'other',
];
