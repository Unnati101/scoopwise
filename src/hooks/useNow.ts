'use client';

import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => null;

/** Current time in ms, refreshed every `periodMs`. Null on the server so markup matches at hydration. */
export function useNow(periodMs = 1000): number | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const id = setInterval(onChange, periodMs);
      return () => clearInterval(id);
    },
    [periodMs],
  );
  const getSnapshot = useCallback(() => Math.floor(Date.now() / periodMs) * periodMs, [periodMs]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
