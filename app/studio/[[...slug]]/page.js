import { redirect } from 'next/navigation';
import StandaloneShell from '@/components/StandaloneShell';
import { getStudioShellProps } from '@/lib/ogi/studio-shell-props.server';
import { isAuthRequired } from '@/lib/ogi/constants';
import { createClient } from '@/lib/supabase/server';
import { loadStudioPageContext } from '@/lib/workspace/studio-page-context.server';
import { localizeTeamPath } from '@/lib/locales';
import { pageTitle } from '@/lib/ogi/branding';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: pageTitle('Studio'),
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
  let activatedWorkspaces = [];
  let hasUnactivatedTeam = false;
  let oneIdLabel = null;

  if (user) {
    const ctx = await loadStudioPageContext(supabase, user);
    workspaceId = ctx.workspaceId;
    workspaces = ctx.workspaces ?? [];
    activatedWorkspaces = ctx.activatedWorkspaces ?? [];
    hasUnactivatedTeam = ctx.hasUnactivatedTeam ?? false;
    oneIdLabel = ctx.oneIdLabel;
  }

  return (
    <StandaloneShell
      {...shellProps}
      userId={user?.id ?? null}
      userEmail={user?.email ?? null}
      oneId={oneIdLabel}
      workspaceId={workspaceId}
      workspaces={workspaces}
      activatedWorkspaces={activatedWorkspaces}
      hasUnactivatedTeam={hasUnactivatedTeam}
      teamPath={localizeTeamPath('en')}
    />
  );
}
