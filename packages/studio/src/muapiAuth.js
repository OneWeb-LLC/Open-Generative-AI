/** Must match `OWEB_HOSTED_CLIENT_KEY` in the Next.js app (`lib/ogi/oweb-hosted.js`). */
export const OWEB_HOSTED_CLIENT_KEY = 'oweb-hosted';

/**
 * @param {string | null | undefined} key
 * @returns {boolean}
 */
export function isOwebHostedClientKey(key) {
  return key === OWEB_HOSTED_CLIENT_KEY;
}

/**
 * @param {string | null | undefined} key
 * @returns {Record<string, string>}
 */
export function muapiKeyHeaders(key) {
  if (!key || isOwebHostedClientKey(key)) return {};
  return { 'x-api-key': key };
}
