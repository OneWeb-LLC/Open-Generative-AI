import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGenerationMetadata,
  formatGenerationCostLabel,
} from '../packages/studio/src/utils/generationMetadata.js';

test('buildGenerationMetadata extracts MuAPI cost block', () => {
  const meta = buildGenerationMetadata(
    { request_id: 'abc', cost: { cost: 0.12, currency: 'usd' } },
    { provider: 'muapi-proxy', model: 'kling-v2.6-t2v' },
  );
  assert.equal(meta.requestId, 'abc');
  assert.equal(meta.cost, 0.12);
  assert.equal(meta.currency, 'USD');
  assert.equal(meta.model, 'kling-v2.6-t2v');
});

test('formatGenerationCostLabel prefers actual cost over estimate', () => {
  const label = formatGenerationCostLabel({
    cost: 2,
    currency: 'CREDITS',
    estimatedCost: 1,
    estimatedCurrency: 'USD',
  });
  assert.match(label, /2 cr/);
});
