/** Must match OWeb `OGI_HOSTED_CLIENT_KEY` in studio-ogi/muapi-proxy.server.ts */
export const OWEB_HOSTED_CLIENT_KEY = 'oweb-hosted';

/**
 * @param {string | null | undefined} key
 * @returns {boolean}
 */
export function isOwebHostedClientKey(key) {
  return key === OWEB_HOSTED_CLIENT_KEY;
}
