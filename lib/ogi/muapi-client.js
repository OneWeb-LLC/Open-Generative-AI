/** Sentinel passed to studio components when MUAPI_KEY is set on the server (not a real credential). */
export const PLATFORM_MANAGED_MUAPI_KEY = '__ogi_platform_muapi__';

/**
 * @param {string | null | undefined} key
 * @returns {boolean}
 */
export function isPlatformManagedMuapiKey(key) {
  return key === PLATFORM_MANAGED_MUAPI_KEY;
}

/**
 * @param {string | null | undefined} raw
 * @returns {string | null}
 */
export function normalizeMuapiClientKey(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || isPlatformManagedMuapiKey(trimmed)) return null;
  return trimmed;
}
