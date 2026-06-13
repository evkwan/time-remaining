import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GoalFormDialog } from './goal-form-dialog';
import { useGoals } from '@/hooks/use-goals';
import { makeGoal, makeGoalsContext } from '@/test/goals';

vi.mock('@/hooks/use-goals', () => ({ useGoals: vi.fn() }));

const mockUseGoals = vi.mocked(useGoals);

describe('GoalFormDialog', () => {
  it('renders nothing when the dialog is closed', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext() as never);
    render(<GoalFormDialog />);

    expect(screen.queryByText('New Goal')).not.toBeInTheDocument();
  });

  it('opens in create mode with empty fields and a default deadline', () => {
    mockUseGoals.mockReturnValue(
      makeGoalsContext({ formState: { isOpen: true, editingGoalId: null } }) as never,
    );
    render(<GoalFormDialog />);

    expect(screen.getByText('New Goal')).toBeInTheDocument();
    expect(screen.getByLabelText('Goal Title')).toHaveValue('');
    const date = screen.getByLabelText('Target Deadline') as HTMLInputElement;
    expect(date.value).toMatch(/-12-31$/);
  });

  it('disables submit until a title is entered', async () => {
    mockUseGoals.mockReturnValue(
      makeGoalsContext({ formState: { isOpen: true, editingGoalId: null } }) as never,
    );
    const user = userEvent.setup();
    render(<GoalFormDialog />);

    const submit = screen.getByRole('button', { name: 'Create Goal' });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText('Goal Title'), 'Write a book');
    expect(submit).toBeEnabled();
  });

  it('submits a new goal via add() and closes', async () => {
    const ctx = makeGoalsContext({
      formState: { isOpen: true, editingGoalId: null },
    });
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<GoalFormDialog />);

    await user.type(screen.getByLabelText('Goal Title'), 'Write a book');
    await user.click(screen.getByRole('button', { name: 'Create Goal' }));

    expect(ctx.add).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Write a book', category: 'target' }),
    );
    expect(ctx.closeGoalForm).toHaveBeenCalled();
  });

  it('prefills fields and shows Delete in edit mode', () => {
    const goal = makeGoal({ id: 'edit-1', title: 'Existing goal' });
    mockUseGoals.mockReturnValue(
      makeGoalsContext({
        formState: { isOpen: true, editingGoalId: 'edit-1' },
        editingGoal: goal,
      }) as never,
    );
    render(<GoalFormDialog />);

    expect(screen.getByText('Edit Goal')).toBeInTheDocument();
    expect(screen.getByLabelText('Goal Title')).toHaveValue('Existing goal');
    expect(screen.getByRole('button', { name: 'Delete Goal' })).toBeInTheDocument();
  });

  it('updates an existing goal via update() on save', async () => {
    const goal = makeGoal({ id: 'edit-1', title: 'Existing goal' });
    const ctx = makeGoalsContext({
      formState: { isOpen: true, editingGoalId: 'edit-1' },
      editingGoal: goal,
    });
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<GoalFormDialog />);

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(ctx.update).toHaveBeenCalledWith(
      'edit-1',
      expect.objectContaining({ title: 'Existing goal' }),
    );
    expect(ctx.closeGoalForm).toHaveBeenCalled();
  });

  it('deletes a goal via remove() and closes', async () => {
    const goal = makeGoal({ id: 'edit-1' });
    const ctx = makeGoalsContext({
      formState: { isOpen: true, editingGoalId: 'edit-1' },
      editingGoal: goal,
    });
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<GoalFormDialog />);

    await user.click(screen.getByRole('button', { name: 'Delete Goal' }));

    expect(ctx.remove).toHaveBeenCalledWith('edit-1');
    expect(ctx.closeGoalForm).toHaveBeenCalled();
  });
});
