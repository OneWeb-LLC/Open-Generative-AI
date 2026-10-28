import assert from 'node:assert/strict';
import test from 'node:test';
import { buildGatewayVideoModelPriceSuffix } from '../lib/ogi/gateway-video-pricing.js';

test('buildGatewayVideoModelPriceSuffix skips misleading video input pricing', () => {
  const suffix = buildGatewayVideoModelPriceSuffix({
    gatewayModel: 'bytedance/seedance-2.0-mini',
    pricing: { input: '0.25', output: '0' },
    durationSeconds: 5,
  });
  assert.ok(suffix);
  assert.match(suffix, /~\$0\.25/);
});

test('buildGatewayVideoModelPriceSuffix prefers gateway per-second output', () => {
  const suffix = buildGatewayVideoModelPriceSuffix({
    gatewayModel: 'bytedance/seedance-v1.0-pro',
    pricing: { input: '0.25', output: '0.02' },
    durationSeconds: 5,
  });
  assert.equal(suffix, ' · $0.02/sec');
});
