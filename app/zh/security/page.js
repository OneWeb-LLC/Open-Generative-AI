import MarketingSecurity from '@/components/marketing/MarketingSecurity';
import MarketingShell from '@/components/marketing/MarketingShell';
import { getMarketingCopy } from '@/lib/marketing/copy';
import { getMarketingAuthState } from '@/lib/marketing/session';
import { pageTitle } from '@/lib/ogi/branding';

export const dynamic = 'force-dynamic';

const LOCALE = 'zh';

export async function generateMetadata() {
  const copy = getMarketingCopy(LOCALE);
  return {
    title: pageTitle('Security'),
    description: copy.meta.securityDescription,
  };
}

export default async function ZhSecurityPage() {
  const copy = getMarketingCopy(LOCALE);
  const { isAuthenticated } = await getMarketingAuthState();

  return (
    <MarketingShell locale={LOCALE} copy={copy} isAuthenticated={isAuthenticated}>
      <MarketingSecurity copy={copy} locale={LOCALE} isAuthenticated={isAuthenticated} />
    </MarketingShell>
  );
}
