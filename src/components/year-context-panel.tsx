import { DateTime } from 'luxon';

import { Badge } from '@/components/ui/badge';
import { getYearContext } from '@/lib/time';

export function YearContextPanel() {
  const context = getYearContext(DateTime.now());

  return (
    <section
      className="flex w-full max-w-3xl flex-col items-center gap-6 text-center"
      aria-label="Year progress"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="secondary">{context.formattedDate}</Badge>
        <Badge variant="outline">Day {context.dayOfYear}</Badge>
        <Badge variant="outline">Week {context.weekOfYear}</Badge>
      </div>

      <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
        {context.daysRemaining === 0 ? (
          <>
            Today is the{' '}
            <span className="font-medium text-foreground">last day</span> of{' '}
            {context.year}.
          </>
        ) : (
          <>
            {context.daysRemaining < 100 ? 'Just ' : null}
            <span className="font-medium text-foreground">
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
            className="h-full rounded-full bg-foreground transition-all duration-500"
            style={{ width: `${context.percentYearElapsed}%` }}
          />
        </div>
      </div>
    </section>
  );
}
