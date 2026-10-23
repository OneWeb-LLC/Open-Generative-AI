/** Product branding for the Artemiis One OWeb satellite (open-generative-ai). */

export const SITE_NAME = 'Artemiis One';
export const SITE_SHORT_TAGLINE = 'AI image, video, and creative studio';
export const LEGAL_ENTITY = 'OneWeb LLC';
export const PRIVACY_EMAIL = 'privacy@artemiis.one';
export const SUPPORT_EMAIL = 'support@artemiis.one';
export const LEGAL_LAST_UPDATED = 'October 23, 2026';

export const OWEB_ICON_PATH = '/oweb-icon.svg';

export function pageTitle(suffix) {
  if (!suffix) return SITE_NAME;
  return `${suffix} — ${SITE_NAME}`;
}
