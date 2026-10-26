export const VIDEO_JOB_STATUS = {
  QUEUED: "queued",
  RUNNING: "running",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};

export function isPendingVideoJob(entry) {
  if (!entry) return false;
  if (entry.url) return false;
  return (
    entry.status === VIDEO_JOB_STATUS.QUEUED ||
    entry.status === VIDEO_JOB_STATUS.RUNNING ||
    entry.status === VIDEO_JOB_STATUS.FAILED
  );
}

export function countActiveVideoJobs(history) {
  return (history ?? []).filter(
    (entry) =>
      entry.status === VIDEO_JOB_STATUS.QUEUED ||
      entry.status === VIDEO_JOB_STATUS.RUNNING,
  ).length;
}

export function getVideoJobQueuePosition(history, entryId) {
  const pending = (history ?? []).filter(
    (entry) =>
      entry.status === VIDEO_JOB_STATUS.QUEUED ||
      entry.status === VIDEO_JOB_STATUS.RUNNING,
  );
  const index = pending.findIndex((entry) => entry.id === entryId);
  return index === -1 ? 0 : index + 1;
}

export function stripNonPersistableVideoHistory(history) {
  return (history ?? []).filter((entry) => {
    if (!entry?.url) return false;
    if (
      entry.status === VIDEO_JOB_STATUS.QUEUED ||
      entry.status === VIDEO_JOB_STATUS.RUNNING
    ) {
      return false;
    }
    return true;
  });
}

export function patchVideoHistoryEntry(history, entryId, patch) {
  return (history ?? []).map((entry) =>
    entry.id === entryId ? { ...entry, ...patch } : entry,
  );
}

export function promoteNextQueuedVideoJob(history) {
  const hasRunning = (history ?? []).some(
    (entry) => entry.status === VIDEO_JOB_STATUS.RUNNING,
  );
  if (hasRunning) return history;
  const nextIdx = (history ?? []).findIndex(
    (entry) => entry.status === VIDEO_JOB_STATUS.QUEUED,
  );
  if (nextIdx === -1) return history;
  return history.map((entry, idx) =>
    idx === nextIdx
      ? { ...entry, status: VIDEO_JOB_STATUS.RUNNING, startedAt: Date.now() }
      : entry,
  );
}
