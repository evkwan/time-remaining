import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';

import { GoalManagementView } from './goal-management-view';
import { useGoals } from '@/hooks/use-goals';
import { useNow } from '@/hooks/use-now';
import { makeGoal, makeGoalsContext } from '@/test/goals';

vi.mock('@/hooks/use-goals', () => ({ useGoals: vi.fn() }));
vi.mock('@/hooks/use-now', () => ({ useNow: vi.fn() }));

const mockUseGoals = vi.mocked(useGoals);

beforeEach(() => {
  vi.mocked(useNow).mockReturnValue(DateTime.local(2026, 6, 1));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GoalManagementView', () => {
  it('groups goals into active, completed and archived with counts', () => {
    mockUseGoals.mockReturnValue(
      makeGoalsContext({
        active: [makeGoal({ id: 'a' })],
        completed: [makeGoal({ id: 'c', status: 'completed' })],
        archived: [makeGoal({ id: 'r', status: 'archived' })],
      }) as never,
    );
    render(<GoalManagementView />);

    expect(screen.getByText('Active (1)')).toBeInTheDocument();
    expect(screen.getByText('Completed (1)')).toBeInTheDocument();
    expect(screen.getByText('Archived (1)')).toBeInTheDocument();
  });

  it('wires active row actions to complete, edit and delete', async () => {
    const ctx = makeGoalsContext({ active: [makeGoal({ id: 'a' })] });
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<GoalManagementView />);

    await user.click(screen.getByRole('button', { name: 'Mark complete' }));
    await user.click(screen.getByRole('button', { name: 'Edit goal' }));
    await user.click(screen.getByRole('button', { name: 'Delete goal' }));

    expect(ctx.complete).toHaveBeenCalledWith('a');
    expect(ctx.openGoalForm).toHaveBeenCalledWith('a');
    expect(ctx.remove).toHaveBeenCalledWith('a');
  });

  it('archives and deletes from a completed row', async () => {
    const ctx = makeGoalsContext({
      completed: [makeGoal({ id: 'c', status: 'completed' })],
    });
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<GoalManagementView />);

    await user.click(screen.getByRole('button', { name: /Archive/i }));
    await user.click(screen.getByRole('button', { name: 'Delete goal' }));

    expect(ctx.archive).toHaveBeenCalledWith('c');
    expect(ctx.remove).toHaveBeenCalledWith('c');
  });

  it('restores and deletes from an archived row', async () => {
    const ctx = makeGoalsContext({
      archived: [makeGoal({ id: 'r', status: 'archived' })],
    });
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<GoalManagementView />);

    await user.click(screen.getByRole('button', { name: /Restore/i }));
    await user.click(screen.getByRole('button', { name: 'Delete goal' }));

    expect(ctx.reactivate).toHaveBeenCalledWith('r');
    expect(ctx.remove).toHaveBeenCalledWith('r');
  });

  it('shows an empty hint when there are no active goals', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext() as never);
    render(<GoalManagementView />);

    expect(screen.getByText(/No active goals yet/i)).toBeInTheDocument();
  });

  it('exports goals as a JSON download', async () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    (URL as unknown as { createObjectURL: unknown }).createObjectURL =
      createObjectURL;
    (URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = vi.fn();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    mockUseGoals.mockReturnValue(
      makeGoalsContext({ goals: [makeGoal()] }) as never,
    );
    const user = userEvent.setup();
    render(<GoalManagementView />);

    await user.click(screen.getByRole('button', { name: /Export/i }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('imports goals from a selected JSON file', async () => {
    const ctx = makeGoalsContext();
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    const { container } = render(<GoalManagementView />);

    const file = new File(
      [JSON.stringify({ version: 1, goals: [makeGoal({ id: 'imp' })] })],
      'goals.json',
      { type: 'application/json' },
    );
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => expect(ctx.importGoals).toHaveBeenCalled());
    const arg = ctx.importGoals.mock.calls[0][0] as Array<{ id: string }>;
    expect(arg[0].id).toBe('imp');
  });
});
