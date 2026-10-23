import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isOwebBillingEnabled } from '@/lib/ogi/oweb-billing.server';
import { requireWorkspaceMember } from '@/lib/workspace/authz.server';
import { readRequestedWorkspaceId } from '@/lib/workspace/session.server';
import { getOwebAppUrl } from '@/lib/ogi/constants';

/** Workspace OneCredits balance (shared OWeb wallet). */
export async function GET() {
  if (!isOwebBillingEnabled()) {
    return NextResponse.json({ error: 'oweb_billing_disabled' }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const workspaceId = await readRequestedWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspace_required' }, { status: 400 });
  }

  try {
    await requireWorkspaceMember(supabase, workspaceId, user.id);
  } catch {
    return NextResponse.json({ error: 'workspace_forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('ao_orgs')
    .select('id, name, credits_balance, plan, billing_status')
    .eq('id', workspaceId)
    .maybeSingle();

  if (error) {
    console.warn('[ogi wallet] balance read failed', error.message);
    return NextResponse.json({ error: 'balance_unavailable' }, { status: 502 });
  }
  if (!data) {
    return NextResponse.json({ error: 'workspace_not_found' }, { status: 404 });
  }

  return NextResponse.json({
    workspace_id: data.id,
    workspace_name: data.name,
    balance: data.credits_balance ?? 0,
    credits_available: data.credits_balance ?? 0,
    plan: data.plan ?? 'free',
    billing_status: data.billing_status ?? 'active',
    top_up_url: `${getOwebAppUrl()}/billing`,
  });
}
