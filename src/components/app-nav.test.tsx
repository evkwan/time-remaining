import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppNav } from './app-nav';
import { useGoals } from '@/hooks/use-goals';
import { makeGoalsContext } from '@/test/goals';

vi.mock('@/hooks/use-goals', () => ({ useGoals: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

const mockUseGoals = vi.mocked(useGoals);

describe('AppNav', () => {
  it('renders navigation links with the correct hrefs', () => {
    mockUseGoals.mockReturnValue(makeGoalsContext() as never);
    render(<AppNav />);

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(
      screen.getByRole('link', { name: 'Goal Management' }),
    ).toHaveAttribute('href', '/goals');
  });

  it('opens the create form from the Add Goal button', async () => {
    const ctx = makeGoalsContext();
    mockUseGoals.mockReturnValue(ctx as never);
    const user = userEvent.setup();
    render(<AppNav />);

    await user.click(screen.getByRole('button', { name: /Add Goal/i }));

    expect(ctx.openGoalForm).toHaveBeenCalledWith();
  });
});
