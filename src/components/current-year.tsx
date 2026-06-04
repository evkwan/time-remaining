'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

/** Renders the current device-local year, corrected on the client after mount. */
export function CurrentYear() {
  const [year, setYear] = useState(() => DateTime.now().year);

  useEffect(() => setYear(DateTime.now().year), []);

  return <span suppressHydrationWarning>{year}</span>;
}
