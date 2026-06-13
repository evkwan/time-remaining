import type { Metadata } from 'next';

import { GoalManagementView } from '@/components/goals/goal-management-view';

export const metadata: Metadata = {
  title: 'Goal Management',
  description:
    'Manage your annual goals — track active goals, review what you have completed, and archive what is done.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/goals' },
};

export default function GoalsPage() {
  return <GoalManagementView />;
}
