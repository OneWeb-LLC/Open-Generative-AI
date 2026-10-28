import { describe, expect, it } from "vitest";

import {
  DEFAULT_MAX_CONCURRENT_VIDEO_JOBS,
  VIDEO_JOB_STATUS,
  countActiveVideoJobs,
  countRunningVideoJobs,
  getVideoJobQueuePosition,
  isPendingVideoJob,
  promoteNextQueuedVideoJob,
  stripNonPersistableVideoHistory,
} from "./videoGenerationJobQueue.js";

describe("videoGenerationJobQueue", () => {
  it("detects pending jobs without a result url", () => {
    expect(
      isPendingVideoJob({ id: "a", status: VIDEO_JOB_STATUS.QUEUED, url: null }),
    ).toBe(true);
    expect(
      isPendingVideoJob({ id: "b", status: VIDEO_JOB_STATUS.SUCCEEDED, url: "x" }),
    ).toBe(false);
  });

  it("counts queued and running jobs", () => {
    const history = [
      { id: "1", status: VIDEO_JOB_STATUS.RUNNING, url: null },
      { id: "2", status: VIDEO_JOB_STATUS.QUEUED, url: null },
      { id: "3", status: VIDEO_JOB_STATUS.SUCCEEDED, url: "ok" },
    ];
    expect(countActiveVideoJobs(history)).toBe(2);
    expect(countRunningVideoJobs(history)).toBe(1);
    expect(getVideoJobQueuePosition(history, "2")).toBe(1);
  });

  it("promotes up to the concurrent job limit", () => {
    const history = [
      { id: "1", status: VIDEO_JOB_STATUS.QUEUED },
      { id: "2", status: VIDEO_JOB_STATUS.QUEUED },
      { id: "3", status: VIDEO_JOB_STATUS.RUNNING },
    ];
    const promoted = promoteNextQueuedVideoJob(history, 2);
    expect(countRunningVideoJobs(promoted)).toBe(2);
    expect(promoted.find((e) => e.id === "1")?.status).toBe(VIDEO_JOB_STATUS.RUNNING);
    expect(promoted.find((e) => e.id === "2")?.status).toBe(VIDEO_JOB_STATUS.QUEUED);
  });

  it("defaults concurrent limit to five", () => {
    expect(DEFAULT_MAX_CONCURRENT_VIDEO_JOBS).toBe(5);
  });

  it("strips in-flight jobs from persistence", () => {
    const history = [
      { id: "1", status: VIDEO_JOB_STATUS.RUNNING, url: null },
      { id: "2", url: "https://example.com/v.mp4" },
    ];
    expect(stripNonPersistableVideoHistory(history)).toHaveLength(1);
  });
});
