export const VIDEO_JOB_STATUS = {
  QUEUED: "queued",
  RUNNING: "running",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};

/** Max simultaneous MuAPI / gateway video generations in Video Studio. */
export const DEFAULT_MAX_CONCURRENT_VIDEO_JOBS = 5;

export function isPendingVideoJob(entry) {
  if (!entry) return false;
  if (entry.url) return false;
  return (
    entry.status === VIDEO_JOB_STATUS.QUEUED ||
    entry.status === VIDEO_JOB_STATUS.RUNNING ||
    entry.status === VIDEO_JOB_STATUS.FAILED
  );
}

export function countRunningVideoJobs(history) {
  return (history ?? []).filter(
    (entry) => entry.status === VIDEO_JOB_STATUS.RUNNING,
  ).length;
}

export function countActiveVideoJobs(history) {
  return (history ?? []).filter(
    (entry) =>
      entry.status === VIDEO_JOB_STATUS.QUEUED ||
      entry.status === VIDEO_JOB_STATUS.RUNNING,
  ).length;
}

export function getVideoJobQueuePosition(history, entryId) {
  const queued = (history ?? []).filter(
    (entry) => entry.status === VIDEO_JOB_STATUS.QUEUED,
  );
  const index = queued.findIndex((entry) => entry.id === entryId);
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

export function promoteNextQueuedVideoJob(
  history,
  maxConcurrent = DEFAULT_MAX_CONCURRENT_VIDEO_JOBS,
) {
  const running = countRunningVideoJobs(history);
  if (running >= maxConcurrent) return history;
  const slots = Math.max(0, maxConcurrent - running);
  let promoted = 0;
  return (history ?? []).map((entry) => {
    if (
      promoted < slots &&
      entry.status === VIDEO_JOB_STATUS.QUEUED
    ) {
      promoted += 1;
      return { ...entry, status: VIDEO_JOB_STATUS.RUNNING, startedAt: Date.now() };
    }
    return entry;
  });
}
