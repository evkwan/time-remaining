'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  formatCountdownUnit,
  getYearCountdown,
  type YearCountdown,
} from '@/lib/time';
import { cn } from '@/lib/utils';

interface CountdownUnitProps {
  label: string;
  value: string;
  subValue?: string;
  className?: string;
}

function CountdownUnit({ label, value, subValue, className }: CountdownUnitProps) {
  return (
    <div className={cn('flex min-w-[4.5rem] flex-col items-center gap-2', className)}>
      <div className="font-mono text-4xl font-light tabular-nums tracking-tight sm:text-5xl md:text-6xl">
        {value}
        {subValue ? (
          <span className="text-2xl text-muted-foreground sm:text-3xl md:text-4xl">
            .{subValue}
          </span>
        ) : null}
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function CountdownDisplay({ countdown }: { countdown: YearCountdown }) {
  return (
    <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
      <CountdownUnit
        label="Hours"
        value={formatCountdownUnit(countdown.hours)}
      />
      <Separator orientation="vertical" className="hidden h-16 sm:block" />
      <span className="text-2xl text-muted-foreground/40 sm:hidden">:</span>
      <CountdownUnit
        label="Minutes"
        value={formatCountdownUnit(countdown.minutes)}
      />
      <Separator orientation="vertical" className="hidden h-16 sm:block" />
      <span className="text-2xl text-muted-foreground/40 sm:hidden">:</span>
      <CountdownUnit
        label="Seconds"
        value={formatCountdownUnit(countdown.seconds)}
        subValue={formatCountdownUnit(countdown.centiseconds)}
        className="min-w-[5.5rem] sm:min-w-[6.5rem]"
      />
    </div>
  );
}

export function CountdownTimer() {
  const [countdown, setCountdown] = useState<YearCountdown | null>(null);

  useEffect(() => {
    const tick = () => setCountdown(getYearCountdown(DateTime.now()));
    tick();
    const interval = window.setInterval(tick, 50);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-3xl border-border/60 bg-card/80 shadow-lg backdrop-blur-sm">
      <CardContent className="p-6 sm:p-10">
        {countdown ? (
          <CountdownDisplay countdown={countdown} />
        ) : (
          <div
            className="flex h-[7.5rem] items-center justify-center text-sm text-muted-foreground"
            aria-live="polite"
          >
            Calculating…
          </div>
        )}
      </CardContent>
    </Card>
  );
}
