"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function useSimulatedProgress(active) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (!active) {
      setProgress(8);
      return;
    }
    setProgress(8);
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const step = prev < 40 ? 3 : prev < 70 ? 2 : 1;
        return Math.min(92, prev + step);
      });
    }, 1400);
    return () => window.clearInterval(interval);
  }, [active]);

  return progress;
}

export function VideoGenerationPendingCard({
  entry,
  queuePosition,
  copy,
  onDelete,
}) {
  const isQueued = entry.status === "queued";
  const isFailed = entry.status === "failed";
  const isRunning = entry.status === "running";
  const progress = useSimulatedProgress(isRunning);

  const statusCopy = copy.jobStatus ?? {};

  return (
    <div
      className={`relative group rounded-lg overflow-hidden border shadow-xl transition-all duration-300 flex flex-col ${
        isFailed
          ? "border-red-500/40 bg-[#140a0a]"
          : isQueued
            ? "border-dashed border-[color:var(--ogi-accent-ring,rgba(34,211,238,0.35))] bg-[#0a0a0a]"
            : "border-white/10 bg-[#0a0a0a] hover:border-primary/40"
      }`}
      data-ogi-video-job-status={entry.status}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-[#050505]">
        {isQueued ? (
          <div className="ogi-video-job-queued absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            <div className="ogi-video-job-queued__icon flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="4" rx="1" fill="currentColor" className="text-white/25" />
                <rect x="3" y="11" width="18" height="4" rx="1" fill="currentColor" className="text-white/35" />
                <rect x="3" y="17" width="18" height="4" rx="1" fill="currentColor" className="text-white/45" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white/80 text-center">
              {queuePosition > 1
                ? (statusCopy.queuedPosition ?? "Queued · position {position}").replace(
                    "{position}",
                    String(queuePosition),
                  )
                : (statusCopy.queued ?? "Queued")}
            </p>
            <div className="flex w-full max-w-[70%] flex-col gap-1.5">
              <div className="ogi-video-job-shimmer h-2 rounded-full bg-white/[0.06]" />
              <div className="ogi-video-job-shimmer ogi-video-job-shimmer--delay h-2 w-[82%] rounded-full bg-white/[0.05]" />
              <div className="ogi-video-job-shimmer ogi-video-job-shimmer--delay-2 h-2 w-[64%] rounded-full bg-white/[0.04]" />
            </div>
          </div>
        ) : isFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-sm font-semibold text-red-300">
              {statusCopy.failed ?? "Generation failed"}
            </span>
            {entry.error ? (
              <p className="text-xs text-red-200/70 line-clamp-3">{entry.error}</p>
            ) : null}
          </div>
        ) : (
          <div className="ogi-video-job-render absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#101820] via-[#06080c] to-[#030303]" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_65%)]" />
            <div className="absolute inset-x-[18%] bottom-[22%] top-[30%] rounded-2xl bg-white/[0.03] blur-2xl" />
            <div
              className="ogi-video-job-scanline absolute left-0 right-0 h-[2px] bg-[color:var(--ogi-accent,#22d3ee)] shadow-[0_0_18px_var(--ogi-accent,#22d3ee)]"
              style={{ top: `${Math.max(12, Math.min(88, progress))}%` }}
            />
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-md">
              <Loader2 className="size-3 animate-spin text-[color:var(--ogi-accent,#22d3ee)]" />
              {statusCopy.rendering ?? "Rendering"}
            </div>
            <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white/70 backdrop-blur-md">
              {statusCopy.estimatedTime ?? "Est. ~2 min"}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/[0.06]">
              <div
                className="h-full bg-[color:var(--ogi-accent,#22d3ee)] transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-black/80 backdrop-blur-sm border-t border-white/5 flex-1 flex flex-col justify-between gap-2">
        <p className="text-white/70 text-xs line-clamp-3 leading-relaxed" title={entry.prompt}>
          {entry.prompt || copy.gallery?.noPromptProvided || "No prompt provided"}
        </p>
        <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20 whitespace-nowrap capitalize">
              {entry.model?.replace(/-/g, " ") || copy.gallery?.fallbackTitle || "Video"}
            </span>
            {entry.duration ? (
              <span className="text-[10px] text-white/40">{entry.duration}s</span>
            ) : null}
            {isRunning ? (
              <span className="text-[10px] font-mono text-[color:var(--ogi-accent,#22d3ee)]">
                {progress}%
              </span>
            ) : null}
          </div>
          {isFailed && onDelete ? (
            <button
              type="button"
              className="text-[10px] text-white/50 hover:text-white underline"
              onClick={() => onDelete()}
            >
              {statusCopy.dismiss ?? "Dismiss"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
