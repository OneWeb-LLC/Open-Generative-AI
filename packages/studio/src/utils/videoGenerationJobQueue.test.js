import { describe, expect, it } from "vitest";

import {
  VIDEO_JOB_STATUS,
  countActiveVideoJobs,
  getVideoJobQueuePosition,
  isPendingVideoJob,
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
    expect(getVideoJobQueuePosition(history, "2")).toBe(2);
  });

  it("strips in-flight jobs from persistence", () => {
    const history = [
      { id: "1", status: VIDEO_JOB_STATUS.RUNNING, url: null },
      { id: "2", url: "https://example.com/v.mp4" },
    ];
    expect(stripNonPersistableVideoHistory(history)).toHaveLength(1);
  });
});
