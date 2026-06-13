import { DateTime } from 'luxon';

export function SiteHeader() {
  const year = DateTime.now().year;

  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
        Year {year} · Time Remaining
      </p>
      <h1 className="text-brand-gradient text-balance pb-1 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        How many days are left in {year}?
      </h1>
      <p className="max-w-md text-pretty text-sm text-muted-foreground sm:text-base">
        A live countdown to December 31 — track the days, hours, minutes, and
        seconds left in {year}, and make them count.
      </p>
    </header>
  );
}
