import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCostFromRate,
  estimateConfiguredVideoCost,
  resolveConfiguredCostRate,
} from '../lib/ogi/generation-cost-estimate.js';

test('computeCostFromRate scales with duration', () => {
  const cost = computeCostFromRate(
    { baseUsd: 0.1, perSecondUsd: 0.02 },
    { durationSeconds: 10 },
  );
  assert.equal(cost, 0.3);
});

test('estimateConfiguredVideoCost for comfy-runpod uses model rates', () => {
  const estimate = estimateConfiguredVideoCost({
    providerId: 'comfy-runpod',
    modelId: 'oweb-sol-t2v',
    duration: 5,
    resolution: '720p',
  });
  assert.ok(estimate);
  assert.equal(estimate.currency, 'USD');
  assert.ok(estimate.cost > 0);
});

test('estimateConfiguredVideoCost for vercel gateway resolves slug from catalog model', () => {
  const estimate = estimateConfiguredVideoCost({
    providerId: 'vercel-ai-gateway',
    modelId: 'veo-3.1',
    duration: 8,
  });
  assert.ok(estimate);
  assert.ok(estimate.cost > 0);
  const rate = resolveConfiguredCostRate('vercel-ai-gateway', 'google/veo-3.1-generate-001');
  assert.ok(rate?.perSecondUsd);
});
