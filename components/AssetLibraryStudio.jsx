'use client';

import { useMemo, useState } from 'react';
import { isImageStudioType } from '@/lib/ogi/workspace-assets';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'other', label: 'Other' },
];

/**
 * @param {{
 *   items: Array<Record<string, unknown>>;
 *   loading?: boolean;
 *   error?: string | null;
 *   onOpenInStudio?: (studioType: string, url: string) => void;
 *   copy?: Record<string, unknown>;
 * }} props
 */
export default function AssetLibraryStudio({
  items = [],
  loading = false,
  error = null,
  onOpenInStudio,
  copy = {},
}) {
  const libraryCopy = copy.library ?? {};
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    return items.filter((row) => {
      const type = row.studio_type || row.historyEntry?.meta?.tabId || 'unknown';
      if (filter === 'all') return true;
      if (filter === 'image') return isImageStudioType(type) || type === 'cinema';
      if (filter === 'video') return type === 'video' || type.includes('video') || type === 'lipsync' || type === 'marketing';
      if (filter === 'audio') return type === 'audio';
      return !['image', 'cinema', 'video', 'lipsync', 'marketing', 'audio'].includes(type);
    });
  }, [filter, items]);

  return (
    <div className="h-full overflow-y-auto bg-[#030303] text-white p-6 md:p-10">
      <header className="mb-8 max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight">
          {libraryCopy.title || 'Asset library'}
        </h1>
        <p className="mt-2 text-sm text-white/45 leading-relaxed">
          {libraryCopy.subtitle ||
            'Everything your team saves in this workspace stays here after you sign out. Videos, images, and audio from all studios.'}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              filter === f.id ? 'bg-[#d9ff00] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {libraryCopy.filters?.[f.id] || f.label}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-white/40">{libraryCopy.loading || 'Loading assets…'}</p>
      )}
      {error && (
        <p className="text-sm text-red-400 mb-4">
          {libraryCopy.errorPrefix || 'Could not load assets:'} {error}
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-white/40">
          {libraryCopy.empty ||
            'No saved assets yet. Sign in, pick a workspace, and generate — outputs sync here automatically.'}
        </p>
      )}

      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((row) => {
          const entry = row.historyEntry;
          const url = entry?.url || row.media_url;
          const studioType = row.studio_type || 'unknown';
          const creator = row.creator?.oneId || row.creator?.displayName;
          const isImage =
            isImageStudioType(studioType) ||
            (url && /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url));

          return (
            <li
              key={row.id || url}
              className="group rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <div className="aspect-video bg-black relative">
                {url && isImage ? (
                  <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : url ? (
                  <video
                    src={url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : null}
              </div>
              <div className="p-3 space-y-1">
                <p className="text-[10px] uppercase tracking-wide text-[#22d3ee] font-bold truncate">
                  {studioType}
                  {creator ? ` · ${creator}` : ''}
                </p>
                <p className="text-xs text-white/75 line-clamp-2 min-h-[2.5rem]">
                  {entry?.prompt || row.prompt || '—'}
                </p>
                {url && onOpenInStudio && (
                  <button
                    type="button"
                    onClick={() => onOpenInStudio(studioType, url)}
                    className="text-[11px] font-bold text-[#d9ff00] hover:underline"
                  >
                    {libraryCopy.open || 'Open in studio →'}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
