/** Must match PLATFORM_MANAGED_MUAPI_KEY in the Next.js app (`lib/ogi/muapi-client.js`). */
export const PLATFORM_MANAGED_MUAPI_KEY = '__ogi_platform_muapi__';

/**
 * @param {string | null | undefined} key
 * @returns {boolean}
 */
export function isPlatformManagedMuapiKey(key) {
  return key === PLATFORM_MANAGED_MUAPI_KEY;
}

/**
 * @param {string | null | undefined} key
 * @returns {Record<string, string>}
 */
export function muapiKeyHeaders(key) {
  if (!key || isPlatformManagedMuapiKey(key)) return {};
  return { 'x-api-key': key };
}
