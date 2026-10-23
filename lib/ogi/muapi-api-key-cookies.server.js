import { cookies } from 'next/headers';
import { resolveMuapiApiKeyFromCookie } from '@/lib/ogi/muapi-api-key.server';

/** MuAPI key from the muapi_key cookie or deployment MUAPI_KEY secret. */
export async function getMuapiApiKeyFromCookies() {
  const cookieStore = await cookies();
  return resolveMuapiApiKeyFromCookie(cookieStore.get('muapi_key')?.value);
}
