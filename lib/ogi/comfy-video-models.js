/** @typedef {{ id: string, label: string, workflow: string, modes: ('t2v'|'i2v')[] }} ComfyVideoModel */

const DEFAULT_COMFY_VIDEO_MODELS = [
  {
    id: 'oweb-sol-t2v',
    label: 'Oweb Sol',
    workflow: 'oweb-sol',
    modes: ['t2v'],
  },
  {
    id: 'oweb-sol-i2v',
    label: 'Oweb Sol',
    workflow: 'oweb-sol',
    modes: ['i2v'],
  },
];

export function getComfyVideoCatalog() {
  const raw = process.env.OGI_COMFY_VIDEO_MODELS || process.env.NEXT_PUBLIC_OGI_COMFY_VIDEO_MODELS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      /* fall through */
    }
  }
  return DEFAULT_COMFY_VIDEO_MODELS;
}

/**
 * @param {string} studioModelId
 * @param {'t2v'|'i2v'} [mode]
 */
export function resolveComfyVideoModel(studioModelId, mode = 't2v') {
  const catalog = getComfyVideoCatalog();
  const hit = catalog.find((m) => m.id === studioModelId);
  if (hit) return hit;
  const byMode = catalog.find((m) => m.modes?.includes(mode));
  return byMode ?? catalog[0];
}
