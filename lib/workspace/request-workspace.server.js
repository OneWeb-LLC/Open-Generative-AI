import { readRequestedWorkspaceId } from '@/lib/workspace/session.server';

/**
 * Resolve active workspace for API handlers: explicit header/body wins, then cookie.
 * @param {Request} request
 * @param {Record<string, unknown>} [body]
 */
export async function resolveRequestWorkspaceId(request, body = {}) {
  const headerId = request.headers.get('x-ogi-workspace-id');
  if (typeof headerId === 'string' && headerId.trim()) {
    return headerId.trim();
  }

  const bodyId = typeof body.workspace_id === 'string' ? body.workspace_id.trim() : '';
  if (bodyId) return bodyId;

  return await readRequestedWorkspaceId();
}
