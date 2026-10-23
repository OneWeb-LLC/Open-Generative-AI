import { getDefaultApiProviderId, getPublicApiProviders } from '@/lib/ogi/api-providers';
import { isMuapiPlatformKeyConfigured } from '@/lib/ogi/muapi-api-key.server';

/** Props shared by /studio and localized studio routes. */
export function getStudioShellProps() {
  return {
    apiProviders: getPublicApiProviders(),
    defaultProviderId: getDefaultApiProviderId(),
    platformMuapiKeyConfigured: isMuapiPlatformKeyConfigured(),
  };
}
