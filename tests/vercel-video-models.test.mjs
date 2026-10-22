import assert from 'node:assert/strict';
import test from 'node:test';

test('resolveGatewayVideoModel maps Kling 3 MuAPI ids to gateway slugs', async () => {
  const { resolveGatewayVideoModel } = await import('../lib/ogi/vercel-video-models.js');
  assert.equal(
    resolveGatewayVideoModel('kling-v3.0-standard-text-to-video'),
    'klingai/kling-v3.0-t2v',
  );
  assert.equal(
    resolveGatewayVideoModel('kling-v3.0-standard-image-to-video'),
    'klingai/kling-v3.0-i2v',
  );
});

test('normalizeGatewayResolution converts studio labels to WxH', async () => {
  const { normalizeGatewayResolution } = await import('../lib/ogi/vercel-video-models.js');
  assert.equal(normalizeGatewayResolution('720p'), '1280x720');
  assert.equal(normalizeGatewayResolution('1920x1080'), '1920x1080');
  assert.equal(normalizeGatewayResolution(undefined), undefined);
});
