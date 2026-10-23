/**
 * Client/server helpers for workspace (tenant) isolation in browser storage.
 * Each OWeb workspace gets distinct BYOK keys and studio draft/history buckets.
 */

/** @param {{ workspaceId?: string | null; userId?: string | null }} scope */
export function tenantStorageScope({ workspaceId, userId } = {}) {
  if (workspaceId) return `ws:${workspaceId}`;
  if (userId) return `user:${userId}`;
  return null;
}
