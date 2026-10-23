/** Map DB row → studio history entry shape (Video/Image studios). */
export function generationRowToHistoryEntry(row, creator = null) {
  if (!row?.media_url) return null;

  const meta = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};

  return {
    id: row.external_id || row.id,
    recordId: row.id,
    url: row.media_url,
    prompt: row.prompt || '',
    model: row.model || '',
    timestamp: row.created_at || new Date().toISOString(),
    meta,
    creator: creator
      ? {
          userId: creator.userId,
          oneId: creator.oneId,
          displayName: creator.displayName,
        }
      : undefined,
  };
}

/** Normalize client POST body into an insert payload. */
export function normalizeGenerationInsert(body, { workspaceId, userId }) {
  const studioType = typeof body.studio_type === 'string' ? body.studio_type.trim() : '';
  const mediaUrl = typeof body.media_url === 'string' ? body.media_url.trim() : '';

  if (!studioType || !mediaUrl) {
    return { error: 'missing_fields' };
  }

  const externalId =
    typeof body.external_id === 'string' && body.external_id.trim()
      ? body.external_id.trim()
      : null;

  const metadata =
    body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
      ? body.metadata
      : {};

  return {
    row: {
      workspace_id: workspaceId,
      user_id: userId,
      studio_type: studioType,
      external_id: externalId,
      media_url: mediaUrl,
      thumbnail_url:
        typeof body.thumbnail_url === 'string' && body.thumbnail_url.trim()
          ? body.thumbnail_url.trim()
          : null,
      prompt: typeof body.prompt === 'string' ? body.prompt : null,
      model: typeof body.model === 'string' ? body.model : null,
      metadata,
    },
  };
}
