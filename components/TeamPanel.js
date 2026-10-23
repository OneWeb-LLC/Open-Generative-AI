'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createTeamWorkspace,
  fetchWorkspaceMembers,
  inviteWorkspaceMemberByEmail,
} from '@/lib/ogi/workspace-generations-client';
import { owebWorkspaceTeamUrl } from '@/lib/ogi/constants';

/**
 * Team onboarding + member management (OneID via OWeb).
 * @param {{ workspaceId: string | null; userId: string | null; workspaces: Array<{ id: string; name: string; slug?: string; kind?: string | null }>; copy: Record<string, unknown>; currentUserOneId?: string | null; onTeamWorkspaceCreated?: () => void }} props
 */
export default function TeamPanel({
  workspaceId,
  userId,
  workspaces = [],
  copy,
  currentUserOneId = null,
  onTeamWorkspaceCreated,
}) {
  const teamCopy = copy?.team ?? {};
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [createBusy, setCreateBusy] = useState(false);

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.id === workspaceId) ?? null,
    [workspaces, workspaceId],
  );

  const callerRole = useMemo(
    () => members.find((m) => String(m.userId) === String(userId))?.role ?? null,
    [members, userId],
  );

  const canManage = callerRole === 'owner' || callerRole === 'admin';

  const loadMembers = useCallback(async () => {
    if (!workspaceId || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const body = await fetchWorkspaceMembers(workspaceId);
      setMembers(body.members ?? []);
    } catch (err) {
      setError(err?.message ?? 'members_failed');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, userId]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const handleInvite = async (event) => {
    event.preventDefault();
    if (!canManage || !inviteEmail.trim()) return;
    setInviteBusy(true);
    setInviteMessage(null);
    setError(null);
    try {
      await inviteWorkspaceMemberByEmail(inviteEmail.trim(), 'member', workspaceId);
      setInviteMessage(teamCopy.inviteSent || 'Invite sent. They will join with their OneID.');
      setInviteEmail('');
      await loadMembers();
    } catch (err) {
      const msg = String(err?.message ?? err);
      if (msg.includes('invite_unavailable') || msg.includes('501')) {
        setInviteMessage(teamCopy.inviteFallback || 'Open One OS to finish the invite.');
      } else {
        setError(msg);
      }
    } finally {
      setInviteBusy(false);
    }
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    if (!teamName.trim()) return;
    setCreateBusy(true);
    setError(null);
    try {
      await createTeamWorkspace({ name: teamName.trim() });
      setTeamName('');
      onTeamWorkspaceCreated?.();
    } catch (err) {
      setError(String(err?.message ?? err));
    } finally {
      setCreateBusy(false);
    }
  };

  const manageUrl = owebWorkspaceTeamUrl(activeWorkspace?.slug ?? null);

  if (!userId) {
    return (
      <p className="text-sm text-white/50">{teamCopy.signInRequired || 'Sign in with OneID to manage a team.'}</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{teamCopy.title || 'Team workspace'}</h3>
        <p className="text-xs text-white/40 leading-relaxed">
          {teamCopy.subtitle ||
            'Invite teammates by email. Everyone signs in with their own OneID; videos and activity stay in this workspace.'}
        </p>
        {currentUserOneId && (
          <p className="mt-2 text-[11px] font-mono text-[#d9ff00]/80">{currentUserOneId}</p>
        )}
      </div>

      <form onSubmit={handleCreateTeam} className="space-y-2 border border-white/10 rounded-lg p-3 bg-white/[0.02]">
        <p className="text-xs font-semibold text-white/70">{teamCopy.createTitle || 'Create a team workspace'}</p>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder={teamCopy.createPlaceholder || 'Acme Creative Team'}
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          disabled={createBusy || !teamName.trim()}
          className="text-xs font-bold rounded-md bg-[#d9ff00] text-black px-3 py-2 disabled:opacity-40"
        >
          {createBusy ? teamCopy.creating || 'Creating…' : teamCopy.createCta || 'Create team'}
        </button>
      </form>

      {workspaceId && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-white/70">
              {teamCopy.membersTitle || 'Members'}
              {activeWorkspace?.name ? ` · ${activeWorkspace.name}` : ''}
            </p>
            <a
              href={manageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-[#22d3ee] hover:underline"
            >
              {teamCopy.manageOnOweb || 'Manage on One OS →'}
            </a>
          </div>

          {loading ? (
            <p className="text-xs text-white/40">{teamCopy.loading || 'Loading members…'}</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {members.map((member) => (
                <li
                  key={member.userId}
                  className="flex items-center justify-between gap-2 rounded-md border border-white/5 bg-white/[0.03] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">
                      {member.oneId || member.displayName || member.userId.slice(0, 8)}
                    </p>
                    {member.displayName && member.oneId && (
                      <p className="text-[11px] text-white/40 truncate">{member.displayName}</p>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-white/30 font-bold shrink-0">
                    {member.role}
                  </span>
                </li>
              ))}
              {!members.length && (
                <li className="text-xs text-white/40">{teamCopy.noMembers || 'No members yet.'}</li>
              )}
            </ul>
          )}

          {canManage && (
            <form onSubmit={handleInvite} className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-white/60">
                {teamCopy.inviteLabel || 'Invite by email (OneID signup required)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  required
                />
                <button
                  type="submit"
                  disabled={inviteBusy}
                  className="shrink-0 rounded-md bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 disabled:opacity-40"
                >
                  {inviteBusy ? '…' : teamCopy.inviteCta || 'Invite'}
                </button>
              </div>
            </form>
          )}

          {!canManage && members.length > 0 && (
            <p className="text-[11px] text-white/35">
              {teamCopy.memberHint || 'Only workspace admins can send invites. Ask your owner to add teammates.'}
            </p>
          )}
        </div>
      )}

      {inviteMessage && <p className="text-xs text-[#d9ff00]">{inviteMessage}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
