import { createClient } from '@/lib/supabase/server';

/** Best-effort session probe for marketing chrome (never throws). */
export async function getMarketingAuthState() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { isAuthenticated: Boolean(user) };
  } catch {
    return { isAuthenticated: false };
  }
}
