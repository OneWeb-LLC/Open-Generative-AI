/** Must match PLATFORM_MANAGED_MUAPI_KEY in the Next.js app (`lib/ogi/muapi-client.js`). */
export const PLATFORM_MANAGED_MUAPI_KEY = '__ogi_platform_muapi__';

/** Must match `OWEB_HOSTED_CLIENT_KEY` in the Next.js app (`lib/ogi/oweb-hosted.js`). */
export const OWEB_HOSTED_CLIENT_KEY = 'oweb-hosted';

/**
 * @param {string | null | undefined} key
 * @returns {boolean}
 */
export function isPlatformManagedMuapiKey(key) {
  return key === PLATFORM_MANAGED_MUAPI_KEY;
}

/**
 * @param {string | null | undefined} key
 * @returns {boolean}
 */
export function isOwebHostedClientKey(key) {
  return key === OWEB_HOSTED_CLIENT_KEY;
}

/**
 * @param {string | null | undefined} key
 * @returns {boolean}
 */
export function isClientManagedMuapiKey(key) {
  return Boolean(key) && !isPlatformManagedMuapiKey(key) && !isOwebHostedClientKey(key);
}

/**
 * @param {string | null | undefined} key
 * @returns {Record<string, string>}
 */
export function muapiKeyHeaders(key) {
  if (!isClientManagedMuapiKey(key)) return {};
  return { 'x-api-key': key };
}
