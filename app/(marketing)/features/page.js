import MarketingFeatures from '@/components/marketing/MarketingFeatures';
import MarketingShell from '@/components/marketing/MarketingShell';
import { getMarketingCopy } from '@/lib/marketing/copy';
import { getMarketingAuthState } from '@/lib/marketing/session';
import { pageTitle } from '@/lib/ogi/branding';
import { DEFAULT_LOCALE } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const copy = getMarketingCopy(DEFAULT_LOCALE);
  return {
    title: pageTitle('Features'),
    description: copy.meta.featuresDescription,
  };
}

export default async function FeaturesPage() {
  const locale = DEFAULT_LOCALE;
  const copy = getMarketingCopy(locale);
  const { isAuthenticated } = await getMarketingAuthState();

  return (
    <MarketingShell locale={locale} copy={copy} isAuthenticated={isAuthenticated}>
      <MarketingFeatures copy={copy} locale={locale} isAuthenticated={isAuthenticated} />
    </MarketingShell>
  );
}
