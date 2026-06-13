import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AchievementsSection } from './achievements-section';
import { useGoals } from '@/hooks/use-goals';
import { makeGoal, makeGoalsContext } from '@/test/goals';

vi.mock('@/hooks/use-goals', () => ({ useGoals: vi.fn() }));

const mockUseGoals = vi.mocked(useGoals);

describe('AchievementsSection', () => {
  it('renders nothing when there are no completed goals', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext({ completed: [] }) as never);
    const { container } = render(<AchievementsSection />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing until hydrated', () => {
    mockUseGoals.mockReturnValue(
      makeGoalsContext({
        isHydrated: false,
        completed: [makeGoal({ status: 'completed' })],
      }) as never,
    );
    const { container } = render(<AchievementsSection />);

    expect(container).toBeEmptyDOMElement();
  });

  it('lists completed goals with a completion date', () => {
    mockUseGoals.mockReturnValue(
      makeGoalsContext({
        completed: [
          makeGoal({
            id: 'c1',
            title: 'Read 12 Books',
            status: 'completed',
            completedAt: '2026-05-20T00:00:00.000Z',
          }),
        ],
      }) as never,
    );
    render(<AchievementsSection />);

    expect(
      screen.getByText('What you achieved this year'),
    ).toBeInTheDocument();
    expect(screen.getByText('Read 12 Books')).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });
});
