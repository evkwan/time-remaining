'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

/**
 * Returns the current device-local time, re-evaluated on the client.
 *
 * Server/static render returns `null` so date-derived UI never gets frozen to
 * build time — components show a fallback until this resolves after mount.
 */
export function useNow(updateMs = 30_000): DateTime | null {
  const [now, setNow] = useState<DateTime | null>(null);

  useEffect(() => {
    const tick = () => setNow(DateTime.now());
    tick();
    const interval = window.setInterval(tick, updateMs);
    return () => window.clearInterval(interval);
  }, [updateMs]);

  return now;
}
