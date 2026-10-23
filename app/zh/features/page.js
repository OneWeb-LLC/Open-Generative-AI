import MarketingFeatures from '@/components/marketing/MarketingFeatures';
import MarketingShell from '@/components/marketing/MarketingShell';
import { getMarketingCopy } from '@/lib/marketing/copy';
import { getMarketingAuthState } from '@/lib/marketing/session';

export const dynamic = 'force-dynamic';

const LOCALE = 'zh';

export async function generateMetadata() {
  const copy = getMarketingCopy(LOCALE);
  return {
    title: copy.meta.featuresTitle,
    description: copy.meta.featuresDescription,
  };
}

export default async function ZhFeaturesPage() {
  const copy = getMarketingCopy(LOCALE);
  const { isAuthenticated } = await getMarketingAuthState();

  return (
    <MarketingShell locale={LOCALE} copy={copy} isAuthenticated={isAuthenticated}>
      <MarketingFeatures copy={copy} locale={LOCALE} isAuthenticated={isAuthenticated} />
    </MarketingShell>
  );
}
