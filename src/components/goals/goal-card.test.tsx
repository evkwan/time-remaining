import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';

import { GoalCard } from './goal-card';
import { useGoals } from '@/hooks/use-goals';
import { useNow } from '@/hooks/use-now';
import { makeGoal, makeGoalsContext } from '@/test/goals';

vi.mock('@/hooks/use-goals', () => ({ useGoals: vi.fn() }));
vi.mock('@/hooks/use-now', () => ({ useNow: vi.fn() }));

const mockUseGoals = vi.mocked(useGoals);
const mockUseNow = vi.mocked(useNow);

beforeEach(() => {
  mockUseNow.mockReturnValue(DateTime.local(2026, 6, 1, 12, 0, 0));
});

describe('GoalCard', () => {
  it('renders the title, description and formatted target date', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext() as never);
    render(<GoalCard goal={makeGoal()} />);

    expect(screen.getByText('Run a marathon')).toBeInTheDocument();
    expect(screen.getByText('Berlin International Race')).toBeInTheDocument();
    expect(screen.getByText('OCT 12')).toBeInTheDocument();
  });

  it('shows time remaining for an active goal', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext() as never);
    render(<GoalCard goal={makeGoal()} />);

    expect(screen.getByText('Time Remaining')).toBeInTheDocument();
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('shows an Overdue label when the deadline has passed', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext() as never);
    mockUseNow.mockReturnValue(DateTime.local(2026, 11, 1, 12, 0, 0));
    render(<GoalCard goal={makeGoal()} />);

    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('calls complete and openGoalForm from the action buttons', async () => {
    const ctx = makeGoalsContext();
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<GoalCard goal={makeGoal({ id: 'abc' })} />);

    await user.click(screen.getByRole('button', { name: 'Mark complete' }));
    await user.click(screen.getByRole('button', { name: 'Edit goal' }));

    expect(ctx.complete).toHaveBeenCalledWith('abc');
    expect(ctx.openGoalForm).toHaveBeenCalledWith('abc');
  });
});
