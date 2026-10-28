import { DEFAULT_MAX_CONCURRENT_VIDEO_JOBS, VIDEO_JOB_STATUS } from "./videoGenerationJobQueue.js";

/**
 * Client-side worker pool for Video Studio generations (MuAPI / Vercel gateway).
 * Caps simultaneous in-flight jobs; additional submits wait in generationQueueRef.
 */
export function createVideoGenerationConcurrencyPool({
  maxConcurrent = DEFAULT_MAX_CONCURRENT_VIDEO_JOBS,
  patchLocalHistoryEntry,
}) {
  const generationQueueRef = { current: [] };
  const generationInFlightRef = { current: 0 };

  function pumpVideoGenerationQueue() {
    while (
      generationInFlightRef.current < maxConcurrent &&
      generationQueueRef.current.length > 0
    ) {
      const next = generationQueueRef.current.shift();
      if (!next) break;
      generationInFlightRef.current += 1;
      patchLocalHistoryEntry(next.jobId, {
        status: VIDEO_JOB_STATUS.RUNNING,
        startedAt: Date.now(),
      });
      void (async () => {
        try {
          await next.run();
        } catch (err) {
          console.error("[VideoStudio] queued generation failed", err);
        } finally {
          generationInFlightRef.current -= 1;
          pumpVideoGenerationQueue();
        }
      })();
    }
  }

  function enqueueVideoGeneration(jobId, run) {
    generationQueueRef.current.push({ jobId, run });
    pumpVideoGenerationQueue();
  }

  return { enqueueVideoGeneration };
}
