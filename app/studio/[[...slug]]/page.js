import { redirect } from 'next/navigation';
import StandaloneShell from '@/components/StandaloneShell';
import { getStudioShellProps } from '@/lib/ogi/studio-shell-props.server';
import { isAuthRequired } from '@/lib/ogi/constants';
import { formatOneId, fetchOneIdHandle, oneIdFromUserMetadata } from '@/lib/oneid';
import { createClient } from '@/lib/supabase/server';
import { establishProductSession } from '@/lib/workspace/session.server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Studio — Open Generative AI',
};

export default async function StudioPage() {
  const shellProps = getStudioShellProps();

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    if (isAuthRequired()) redirect('/login?next=/studio');
    return <StandaloneShell {...shellProps} />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthRequired() && !user) {
    redirect('/login?next=/studio');
  }

  let workspaceId = null;
  let workspaces = [];
  let oneIdLabel = null;

  if (user) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const ctx = await establishProductSession(supabase, user, {
      accessToken: session?.access_token ?? null,
      activationKind: 'sign_in',
      persistCookie: false,
    });
    workspaceId = ctx.workspaceId;
    workspaces = ctx.workspaces ?? [];
    const handle =
      oneIdFromUserMetadata(user) ?? (await fetchOneIdHandle(supabase, user.id));
    oneIdLabel = formatOneId(handle);
  }

  return (
    <StandaloneShell
      {...shellProps}
      userId={user?.id ?? null}
      userEmail={user?.email ?? null}
      oneId={oneIdLabel}
      workspaceId={workspaceId}
      workspaces={workspaces}
    />
  );
}
