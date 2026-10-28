import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatGatewayVideoPriceSuffix,
  resolveGatewayVideoModelStrict,
} from '../lib/ogi/gateway-video-capability.js';

test('resolveGatewayVideoModelStrict maps studio catalog ids', () => {
  assert.equal(
    resolveGatewayVideoModelStrict('veo3.1-text-to-video'),
    'google/veo-3.1-generate-001',
  );
  assert.equal(
    resolveGatewayVideoModelStrict('grok-imagine-image-to-video'),
    'spacexai/grok-imagine-video',
  );
  assert.equal(
    resolveGatewayVideoModelStrict('vercel-grok-video-t2v'),
    'spacexai/grok-imagine-video',
  );
  assert.equal(resolveGatewayVideoModelStrict('seedance-lite-t2v'), null);
  assert.equal(
    resolveGatewayVideoModelStrict('seedance-2-t2v'),
    'bytedance/seedance-2.0',
  );
  assert.equal(
    resolveGatewayVideoModelStrict('seedance-2.5-text-to-video'),
    'bytedance/seedance-2.5',
  );
});

test('formatGatewayVideoPriceSuffix renders compact USD label', () => {
  assert.equal(
    formatGatewayVideoPriceSuffix({ input: '0', output: '0.0125' }),
    ' · $0.01/unit',
  );
  assert.equal(formatGatewayVideoPriceSuffix(null), null);
});

test('formatGatewayVideoPriceSuffix ignores language-model input for video', () => {
  assert.equal(
    formatGatewayVideoPriceSuffix({ input: '0.25', output: '0' }, { modelType: 'video' }),
    null,
  );
  assert.equal(
    formatGatewayVideoPriceSuffix({ input: '0.25', output: '0.05' }, { modelType: 'video' }),
    ' · $0.05/sec',
  );
});
