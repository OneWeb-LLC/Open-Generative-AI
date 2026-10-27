import assert from "node:assert/strict";
import test from "node:test";

import {
  extractGenerationOutputUrl,
  isGenerationResultComplete,
} from "../packages/studio/src/utils/generationLifecycle.js";

test("extractGenerationOutputUrl reads outputs, url, and nested output", () => {
  assert.equal(
    extractGenerationOutputUrl({ outputs: ["https://cdn.example/v.mp4"] }),
    "https://cdn.example/v.mp4",
  );
  assert.equal(
    extractGenerationOutputUrl({ url: "https://cdn.example/direct.mp4" }),
    "https://cdn.example/direct.mp4",
  );
  assert.equal(
    extractGenerationOutputUrl({ output: { url: "https://cdn.example/nested.mp4" } }),
    "https://cdn.example/nested.mp4",
  );
});

test("isGenerationResultComplete accepts success statuses", () => {
  assert.equal(isGenerationResultComplete({ status: "completed" }), true);
  assert.equal(isGenerationResultComplete({ status: "succeeded" }), true);
  assert.equal(isGenerationResultComplete({ status: "complete" }), true);
});

test("isGenerationResultComplete treats processing + output URL as done", () => {
  assert.equal(
    isGenerationResultComplete({
      status: "processing",
      outputs: ["https://cdn.example/late-status.mp4"],
    }),
    true,
  );
});

test("isGenerationResultComplete stays false while pending without media", () => {
  assert.equal(isGenerationResultComplete({ status: "processing" }), false);
  assert.equal(isGenerationResultComplete({ status: "queued" }), false);
});
