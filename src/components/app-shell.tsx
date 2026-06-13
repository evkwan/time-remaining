'use client';

import type { ReactNode } from 'react';

import { AppNav } from '@/components/app-nav';
import { GoalFormDialog } from '@/components/goals/goal-form-dialog';
import { SiteFooter } from '@/components/site-footer';
import { GoalsProvider } from '@/hooks/use-goals';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <GoalsProvider>
      <div className="relative flex min-h-screen flex-col">
        <AppNav />
        <div className="flex-1">{children}</div>
        <div className="mt-16 border-t border-border/60 py-8">
          <SiteFooter />
        </div>
      </div>
      <GoalFormDialog />
    </GoalsProvider>
  );
}
