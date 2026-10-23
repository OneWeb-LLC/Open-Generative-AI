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

test('buildGatewayVideoCallOptions sets Kling mode and drops resolution', async () => {
  const { buildGatewayVideoCallOptions } = await import('../lib/ogi/vercel-video-models.js');
  const std = buildGatewayVideoCallOptions(
    'kling-v3.0-standard-text-to-video',
    'klingai/kling-v3.0-t2v',
    { aspect_ratio: '16:9', duration: 5, resolution: '720p' },
  );
  assert.equal(std.resolution, undefined);
  assert.equal(std.providerOptions?.klingai?.mode, 'std');
  assert.equal(std.aspectRatio, '16:9');

  const pro = buildGatewayVideoCallOptions(
    'kling-v3.0-pro-text-to-video',
    'klingai/kling-v3.0-t2v',
    { resolution: '720p' },
  );
  assert.equal(pro.providerOptions?.klingai?.mode, 'pro');
});
