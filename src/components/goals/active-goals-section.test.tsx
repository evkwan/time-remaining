import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

import { ActiveGoalsSection } from './active-goals-section';
import { useGoals } from '@/hooks/use-goals';
import { useNow } from '@/hooks/use-now';
import { makeGoal, makeGoalsContext } from '@/test/goals';

vi.mock('@/hooks/use-goals', () => ({ useGoals: vi.fn() }));
vi.mock('@/hooks/use-now', () => ({ useNow: vi.fn() }));

const mockUseGoals = vi.mocked(useGoals);

beforeEach(() => {
  vi.mocked(useNow).mockReturnValue(DateTime.local(2026, 6, 1));
});

describe('ActiveGoalsSection', () => {
  it('shows skeletons and no create tile before hydration', () => {
    mockUseGoals.mockReturnValue(
      makeGoalsContext({ isHydrated: false }) as never,
    );
    render(<ActiveGoalsSection />);

    expect(screen.queryByText('Create New Anchor')).not.toBeInTheDocument();
  });

  it('renders a card per active goal plus the create tile', () => {
    mockUseGoals.mockReturnValue(
      makeGoalsContext({
        active: [
          makeGoal({ id: '1', title: 'Goal One' }),
          makeGoal({ id: '2', title: 'Goal Two' }),
        ],
      }) as never,
    );
    render(<ActiveGoalsSection />);

    expect(screen.getByText('Goal One')).toBeInTheDocument();
    expect(screen.getByText('Goal Two')).toBeInTheDocument();
    expect(screen.getByText('Create New Anchor')).toBeInTheDocument();
  });

  it('shows only the create tile when there are no active goals', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext({ active: [] }) as never);
    render(<ActiveGoalsSection />);

    expect(screen.getByText('Create New Anchor')).toBeInTheDocument();
  });
});
