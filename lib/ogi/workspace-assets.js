import { scopedPersistKey } from '../../packages/studio/src/persistKey.js';

/** Studio persist bucket base keys (must match studio components). */
export const STUDIO_PERSIST_BASE_KEYS = {
  image: 'hg_image_studio_persistent',
  video: 'hg_video_studio_persistent',
  lipsync: 'hg_lipsync_studio_persistent',
  cinema: 'hg_cinema_studio_persistent',
  audio: 'hg_audio_studio_persistent',
  marketing: 'hg_marketing_studio_persistent',
  clipping: 'hg_clipping_studio_persistent',
  'motion-control': 'hg_motion_control_studio_persistent',
  'body-swap': 'hg_recast_studio_persistent',
};

/** Map shell tab id → stored studio_type when payload omits `type`. */
export const TAB_TO_STUDIO_TYPE = {
  image: 'image',
  layers: 'image',
  video: 'video',
  clipping: 'clipping',
  'motion-control': 'motion-control',
  'vibe-motion': 'video',
  lipsync: 'lipsync',
  'body-swap': 'body-swap',
  cinema: 'cinema',
  audio: 'audio',
  marketing: 'marketing',
  'ai-influencer': 'video',
};

export function studioTypeFromTab(tabId, data = {}) {
  if (typeof data.type === 'string' && data.type.trim()) return data.type.trim();
  return TAB_TO_STUDIO_TYPE[tabId] || tabId || 'unknown';
}

/** Normalize studio completion payloads into generation insert bodies. */
export function completionToGenerationPayload(data, tabId) {
  const url = typeof data?.url === 'string' ? data.url.trim() : '';
  if (!url) return null;

  const studioType = studioTypeFromTab(tabId, data);
  const externalId =
    data.id ||
    data.requestId ||
    data.request_id ||
    null;

  const prompt =
    typeof data.prompt === 'string'
      ? data.prompt
      : typeof data.settings?.prompt === 'string'
        ? data.settings.prompt
        : '';

  const model = typeof data.model === 'string' ? data.model : '';

  const metadata = {
    tabId,
    ...(data.meta && typeof data.meta === 'object' ? data.meta : {}),
    ...(data.settings && typeof data.settings === 'object' ? { settings: data.settings } : {}),
    ...(data.mode ? { mode: data.mode } : {}),
  };

  const isImage =
    studioType === 'image' ||
    /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url);

  return {
    studio_type: studioType,
    media_url: url,
    external_id: externalId ? String(externalId) : null,
    prompt,
    model,
    thumbnail_url: isImage ? url : data.thumbnail_url || null,
    metadata,
  };
}

function parsePersistedHistory(raw) {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.localHistory)) return data.localHistory;
    if (Array.isArray(data.history)) return data.history;
    return [];
  } catch {
    return [];
  }
}

/** Read local-only history entries for one studio (for cloud backfill). */
export function readLocalStudioHistory(studioType, apiKey, storageScope) {
  const baseKey = STUDIO_PERSIST_BASE_KEYS[studioType];
  if (!baseKey || typeof localStorage === 'undefined') return [];

  const scopedKey = scopedPersistKey(baseKey, apiKey, storageScope);
  const keys = [scopedKey];
  if (scopedKey !== baseKey) keys.push(baseKey);

  const entries = [];
  for (const key of keys) {
    entries.push(...parsePersistedHistory(localStorage.getItem(key)));
  }

  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry?.url || seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

/** Group API generations list into per-studio history arrays. */
export function groupGenerationsByStudio(generations) {
  const grouped = {};
  for (const row of generations ?? []) {
    const entry = row.historyEntry;
    if (!entry || !row.studio_type) continue;
    if (!grouped[row.studio_type]) grouped[row.studio_type] = [];
    grouped[row.studio_type].push(entry);
  }
  return grouped;
}

export function isImageStudioType(studioType) {
  return studioType === 'image' || studioType === 'cinema';
}

export function isVideoStudioType(studioType) {
  return !isImageStudioType(studioType) && studioType !== 'audio';
}
