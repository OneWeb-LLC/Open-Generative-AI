import { DEFAULT_LOCALE, getLocaleConfig, mergeCopy } from '@/lib/locales';
import enMarketing from '@/messages/en/marketing.json';
import zhMarketing from '@/messages/zh/marketing.json';

const BUNDLES = {
  en: enMarketing,
  zh: zhMarketing,
};

export function getMarketingCopy(locale) {
  const config = getLocaleConfig(locale);
  if (config.code === DEFAULT_LOCALE) return enMarketing;
  return mergeCopy(enMarketing, BUNDLES[config.code] || {});
}

export function marketingBasePath(locale) {
  const config = getLocaleConfig(locale);
  return config.rootPath || '';
}

export function marketingPath(locale, segment) {
  const base = marketingBasePath(locale);
  if (!segment) return base || '/';
  const path = segment.startsWith('/') ? segment : `/${segment}`;
  return `${base}${path}`;
}

export function studioDashboardPath(locale) {
  return marketingPath(locale, '/studio');
}

export function loginPath(locale, nextPath) {
  const next = nextPath || studioDashboardPath(locale);
  return `/login?next=${encodeURIComponent(next)}`;
}
