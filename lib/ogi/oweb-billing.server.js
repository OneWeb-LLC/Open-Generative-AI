import { getOwebAppUrl } from './constants.js';

/** When true, studio uses OWeb workspace OneCredits (not BYOK MuAPI). */
export function isOwebBillingEnabled() {
  const flag =
    process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING || process.env.OGI_USE_OWEB_BILLING;
  if (flag === 'true' || flag === '1') return true;
  if (flag === 'false' || flag === '0') return false;
  return Boolean(
    process.env.OGI_OWEB_STUDIO_UPSTREAM?.trim() ||
      process.env.OGI_OWEB_BACKEND_API_UPSTREAM?.trim(),
  );
}

/** Base URL for OWeb `/api/studio/generative/*` (hosted metering). */
export function getOwebStudioGenerativeUpstream() {
  const fromEnv = process.env.OGI_OWEB_STUDIO_UPSTREAM?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return `${getOwebAppUrl().replace(/\/$/, '')}/api/studio/generative`;
}
