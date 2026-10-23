import MarketingHome from '@/components/marketing/MarketingHome';
import MarketingShell from '@/components/marketing/MarketingShell';
import { getMarketingCopy } from '@/lib/marketing/copy';
import { getMarketingAuthState } from '@/lib/marketing/session';

export const dynamic = 'force-dynamic';

const LOCALE = 'zh';

export async function generateMetadata() {
  const copy = getMarketingCopy(LOCALE);
  return {
    title: copy.meta.homeTitle,
    description: copy.meta.homeDescription,
  };
}

export default async function ZhMarketingHomePage() {
  const copy = getMarketingCopy(LOCALE);
  const { isAuthenticated } = await getMarketingAuthState();

  return (
    <MarketingShell locale={LOCALE} copy={copy} isAuthenticated={isAuthenticated}>
      <MarketingHome copy={copy} locale={LOCALE} isAuthenticated={isAuthenticated} />
    </MarketingShell>
  );
}
