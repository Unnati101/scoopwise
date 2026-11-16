import type { z } from 'zod';

/** A tiny localStorage-backed store that works with `useSyncExternalStore` and syncs across tabs. */
export function createLocalStore<T>(key: string, schema: z.ZodType<T>, empty: T) {
  let value = empty;
  let loaded = false;
  const listeners = new Set<() => void>();

  const notify = () => listeners.forEach((listener) => listener());

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? schema.safeParse(JSON.parse(raw)) : null;
      return parsed?.success ? parsed.data : empty;
    } catch {
      // Unreadable storage just means the default value.
      return empty;
    }
  };

  const ensureLoaded = () => {
    if (loaded || typeof window === 'undefined') return;
    loaded = true;
    value = read();
    window.addEventListener('storage', (event) => {
      if (event.key !== key) return;
      value = read();
      notify();
    });
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getSnapshot(): T {
      ensureLoaded();
      return value;
    },

    getServerSnapshot(): T {
      return empty;
    },

    set(next: T) {
      ensureLoaded();
      value = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage can be unavailable (private mode); the value still works in memory.
      }
      notify();
    },
  };
}
