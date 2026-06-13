import { Code2, MoreHorizontal, Palette, Target, type LucideIcon } from 'lucide-react';

import type { GoalCategory } from '@/lib/goals/types';

interface CategoryMeta {
  label: string;
  Icon: LucideIcon;
}

export const GOAL_CATEGORY_META: Record<GoalCategory, CategoryMeta> = {
  target: { label: 'Milestone', Icon: Target },
  code: { label: 'Build', Icon: Code2 },
  palette: { label: 'Creative', Icon: Palette },
  other: { label: 'Other', Icon: MoreHorizontal },
};

export function GoalCategoryIcon({
  category,
  className,
}: {
  category: GoalCategory;
  className?: string;
}) {
  const { Icon } = GOAL_CATEGORY_META[category];
  return <Icon className={className} />;
}
