import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGenerationMetadata,
  formatGenerationCostLabel,
} from '../packages/studio/src/utils/generationMetadata.js';

test('buildGenerationMetadata extracts MuAPI USD cost block', () => {
  const meta = buildGenerationMetadata(
    { request_id: 'abc', cost: { cost: 0.12, currency: 'usd' } },
    { provider: 'muapi-proxy', model: 'kling-v2.6-t2v' },
  );
  assert.equal(meta.requestId, 'abc');
  assert.equal(meta.priceUsd, 0.12);
  assert.equal(meta.currency, 'USD');
  assert.equal(meta.model, 'kling-v2.6-t2v');
});

test('buildGenerationMetadata uses MuAPI estimate when only credits are returned', () => {
  const meta = buildGenerationMetadata(
    { cost: { amount_credits: 47 } },
    {
      provider: 'muapi-proxy',
      estimatedCost: 0.47,
      estimatedCurrency: 'USD',
    },
  );
  assert.equal(meta.credits, 47);
  assert.equal(meta.priceUsd, 0.47);
  assert.equal(meta.priceSource, 'estimate');
});

test('buildGenerationMetadata reads gateway priceUsd from metadata', () => {
  const meta = buildGenerationMetadata(
    {
      metadata: {
        priceUsd: 0.0842,
        priceSource: 'actual',
        generationId: 'gen_test',
      },
    },
    { provider: 'vercel-ai-gateway', gatewayModel: 'klingai/kling-v3.0-t2v' },
  );
  assert.equal(meta.priceUsd, 0.0842);
  assert.equal(meta.generationId, 'gen_test');
});

test('formatGenerationCostLabel prefers actual USD over credits', () => {
  const label = formatGenerationCostLabel({
    priceUsd: 0.12,
    priceSource: 'actual',
    cost: 47,
    currency: 'CREDITS',
    credits: 47,
  });
  assert.match(label, /\$0\.1200 USD/);
});

test('formatGenerationCostLabel shows estimate prefix for gateway estimate', () => {
  const label = formatGenerationCostLabel({
    priceUsd: 0.5,
    priceSource: 'estimate',
  });
  assert.equal(label, '~$0.5000 USD');
});
