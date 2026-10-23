import { redirect } from 'next/navigation';
import TeamWorkspaceHub from '@/components/TeamWorkspaceHub';
import { isAuthRequired } from '@/lib/ogi/constants';
import { pageTitle } from '@/lib/ogi/branding';
import { getCommonCopy, localizeStudioPath, localizeTeamPath } from '@/lib/locales';
import { createClient } from '@/lib/supabase/server';
import { loadStudioPageContext } from '@/lib/workspace/studio-page-context.server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: pageTitle('Team workspaces'),
};

export default async function StudioTeamPage() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    if (isAuthRequired()) redirect('/login?next=/studio/team');
    redirect('/login?next=/studio/team');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthRequired() && !user) {
    redirect('/login?next=/studio/team');
  }

  if (!user) {
    redirect('/login?next=/studio/team');
  }

  const ctx = await loadStudioPageContext(supabase, user);
  const copy = getCommonCopy('en');

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <a href={localizeStudioPath('en', 'image')} className="text-sm font-bold text-[#22d3ee]">
          ← Studio
        </a>
      </header>
      <TeamWorkspaceHub
        userId={user.id}
        oneId={ctx.oneIdLabel}
        initialCatalog={ctx.workspaceCatalog}
        activeWorkspaceId={ctx.workspaceId}
        teamPath={localizeTeamPath('en')}
        studioPath={localizeStudioPath('en', 'image')}
        copy={copy}
      />
    </div>
  );
}
