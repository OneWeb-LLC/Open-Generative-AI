/**
 * Server-only MuAPI credential resolution (Vercel secret MUAPI_KEY).
 * @see PLATFORM_MANAGED_MUAPI_KEY in ./muapi-client.js (client sentinel — not a secret).
 */

import {
  isPlatformManagedMuapiKey,
  normalizeMuapiClientKey,
} from './muapi-client.js';

export { isPlatformManagedMuapiKey } from './muapi-client.js';

/** @returns {string | null} */
export function getMuapiPlatformKey() {
  const raw = process.env.MUAPI_KEY;
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isMuapiPlatformKeyConfigured() {
  return Boolean(getMuapiPlatformKey());
}

/**
 * Resolve the MuAPI key for an incoming API proxy request.
 * Client BYOK wins; otherwise use MUAPI_KEY from the deployment environment.
 * @param {Request} request
 * @returns {string | null}
 */
export function resolveMuapiApiKeyFromRequest(request) {
  const headerKey = normalizeMuapiClientKey(request?.headers?.get?.('x-api-key'));
  if (headerKey) return headerKey;

  const authHeader = request?.headers?.get?.('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  return getMuapiPlatformKey();
}

/**
 * @param {string | null | undefined} cookieValue
 * @returns {string | null}
 */
export function resolveMuapiApiKeyFromCookie(cookieValue) {
  const fromCookie = normalizeMuapiClientKey(cookieValue);
  if (fromCookie) return fromCookie;
  return getMuapiPlatformKey();
}
