import MarketingHome from '@/components/marketing/MarketingHome';
import MarketingShell from '@/components/marketing/MarketingShell';
import { getMarketingCopy } from '@/lib/marketing/copy';
import { getMarketingAuthState } from '@/lib/marketing/session';
import { SITE_SHORT_TAGLINE, pageTitle } from '@/lib/ogi/branding';
import { DEFAULT_LOCALE } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const copy = getMarketingCopy(DEFAULT_LOCALE);
  return {
    title: pageTitle(SITE_SHORT_TAGLINE),
    description: copy.meta.homeDescription,
  };
}

export default async function MarketingHomePage() {
  const locale = DEFAULT_LOCALE;
  const copy = getMarketingCopy(locale);
  const { isAuthenticated } = await getMarketingAuthState();

  return (
    <MarketingShell locale={locale} copy={copy} isAuthenticated={isAuthenticated}>
      <MarketingHome copy={copy} locale={locale} isAuthenticated={isAuthenticated} />
    </MarketingShell>
  );
}
