'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGoals } from '@/hooks/use-goals';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/goals', label: 'Goal Management' },
];

export function AppNav() {
  const pathname = usePathname();
  const { openGoalForm } = useGoals();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/icon-192.png"
            alt="Year Left logo"
            width={24}
            height={24}
            className="h-6 w-6 rounded-md"
            priority
          />
          <span>Year Left</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'pb-1',
                    isActive &&
                      'bg-brand-gradient bg-[length:100%_2px] bg-bottom bg-no-repeat',
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
          <Button
            size="sm"
            onClick={() => openGoalForm()}
            className="ml-1 bg-brand-gradient font-semibold text-slate-900 shadow transition-[filter] hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Goal</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
