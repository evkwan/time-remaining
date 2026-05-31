import { DateTime } from 'luxon';

import { Badge } from '@/components/ui/badge';
import { getYearContext } from '@/lib/time';
import { cn } from '@/lib/utils';

export function YearContextPanel() {
  const context = getYearContext(DateTime.now());
  const isUrgent = context.daysRemaining > 0 && context.daysRemaining < 100;

  return (
    <section
      className="flex w-full max-w-3xl flex-col items-center gap-6 text-center"
      aria-label="Year progress"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="sky">{context.formattedDate}</Badge>
        <Badge variant="emerald">Day {context.dayOfYear}</Badge>
        <Badge variant="amber">Week {context.weekOfYear}</Badge>
      </div>

      <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
        {context.daysRemaining === 0 ? (
          <>
            Today is the{' '}
            <span className="font-semibold text-rose-500 dark:text-rose-400">
              last day
            </span>{' '}
            of {context.year}.
          </>
        ) : (
          <>
            {context.daysRemaining < 100 ? 'Just ' : null}
            <span
              className={cn(
                'font-semibold',
                isUrgent
                  ? 'text-rose-500 dark:text-rose-400'
                  : 'text-foreground',
              )}
            >
              {context.daysRemaining} day{context.daysRemaining === 1 ? '' : 's'}
            </span>{' '}
            left in {context.year}.
          </>
        )}
      </p>

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{context.percentYearElapsed}% of the year elapsed</span>
          <span>
            {context.dayOfYear} / {context.daysInYear} days
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={context.percentYearElapsed}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Year progress"
        >
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r transition-all duration-500',
              isUrgent
                ? 'from-amber-400 to-rose-500'
                : 'from-sky-400 via-emerald-400 to-amber-400',
            )}
            style={{ width: `${context.percentYearElapsed}%` }}
          />
        </div>
      </div>
    </section>
  );
}
