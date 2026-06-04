import { CurrentYear } from '@/components/current-year';

export function SiteHeader() {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
        Year <CurrentYear />
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        Time remaining
      </h1>
      <p className="max-w-md text-pretty text-sm text-muted-foreground sm:text-base">
        A live countdown to December 31 — so you can make what&apos;s left of
        this year count.
      </p>
    </header>
  );
}
