import MarketingPricing from '@/components/marketing/MarketingPricing';
import MarketingShell from '@/components/marketing/MarketingShell';
import { getMarketingCopy } from '@/lib/marketing/copy';
import { getMarketingAuthState } from '@/lib/marketing/session';
import { pageTitle } from '@/lib/ogi/branding';
import { DEFAULT_LOCALE } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const copy = getMarketingCopy(DEFAULT_LOCALE);
  return {
    title: pageTitle('Pricing'),
    description: copy.meta.pricingDescription,
  };
}

export default async function PricingPage() {
  const locale = DEFAULT_LOCALE;
  const copy = getMarketingCopy(locale);
  const { isAuthenticated } = await getMarketingAuthState();

  return (
    <MarketingShell locale={locale} copy={copy} isAuthenticated={isAuthenticated}>
      <MarketingPricing copy={copy} locale={locale} isAuthenticated={isAuthenticated} />
    </MarketingShell>
  );
}
