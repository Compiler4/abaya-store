export function readStoredJson<T>(
  key: string,
  fallback: T,
  options: { clearInvalid?: boolean } = {},
): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;

    return JSON.parse(value) as T;
  } catch {
    if (options.clearInvalid) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Storage may be unavailable in private browsing.
      }
    }

    return fallback;
  }
}

