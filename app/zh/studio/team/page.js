import { redirect } from 'next/navigation';
import TeamWorkspaceHub from '@/components/TeamWorkspaceHub';
import { getCommonCopy, localizeStudioPath, localizeTeamPath } from '@/lib/locales';
import { isAuthRequired } from '@/lib/ogi/constants';
import { pageTitle } from '@/lib/ogi/branding';
import { createClient } from '@/lib/supabase/server';
import { loadStudioPageContext } from '@/lib/workspace/studio-page-context.server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: pageTitle('Team workspaces'),
};

export default async function ZhStudioTeamPage() {
  const copy = getCommonCopy('zh');

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    if (isAuthRequired()) redirect('/login?next=/zh/studio/team');
    redirect('/login?next=/zh/studio/team');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/zh/studio/team');
  }

  const ctx = await loadStudioPageContext(supabase, user);

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <a href={localizeStudioPath('zh', 'image')} className="text-sm font-bold text-[#22d3ee]">
          ← Studio
        </a>
      </header>
      <TeamWorkspaceHub
        locale="zh"
        userId={user.id}
        oneId={ctx.oneIdLabel}
        initialCatalog={ctx.workspaceCatalog}
        activeWorkspaceId={ctx.workspaceId}
        teamPath={localizeTeamPath('zh')}
        studioPath={localizeStudioPath('zh', 'image')}
        copy={copy}
      />
    </div>
  );
}
