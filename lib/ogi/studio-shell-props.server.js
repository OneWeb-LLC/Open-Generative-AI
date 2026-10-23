import { getDefaultApiProviderId, getPublicApiProviders } from '@/lib/ogi/api-providers';
import { isOwebBillingEnabled } from '@/lib/ogi/oweb-billing.server';

export function getStudioShellProps() {
  const owebBillingEnabled = isOwebBillingEnabled();
  return {
    apiProviders: getPublicApiProviders(),
    defaultProviderId: getDefaultApiProviderId(),
    owebBillingEnabled,
  };
}
