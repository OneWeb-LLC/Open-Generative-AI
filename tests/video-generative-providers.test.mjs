import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isVideoModelVisibleForApiProvider,
} from '../packages/studio/src/videoGenerativeProviders.js';

test('comfy-runpod only shows Oweb Sol models', () => {
  assert.equal(
    isVideoModelVisibleForApiProvider({ id: 'oweb-sol-t2v', generativeProviders: ['comfy-runpod'] }, 'comfy-runpod'),
    true,
  );
  assert.equal(
    isVideoModelVisibleForApiProvider({ id: 'seedance-lite-t2v' }, 'comfy-runpod'),
    false,
  );
});

test('muapi hides Oweb Sol', () => {
  assert.equal(
    isVideoModelVisibleForApiProvider({ id: 'oweb-sol-t2v', generativeProviders: ['comfy-runpod'] }, 'muapi-proxy'),
    false,
  );
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'seedance-lite-t2v' }, 'muapi-proxy'), true);
});

test('vercel gateway shows mapped MuAPI catalog models', () => {
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'veo3.1-text-to-video' }, 'vercel-ai-gateway'), true);
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'grok-imagine-text-to-video' }, 'vercel-ai-gateway'), true);
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'seedance-2.5-text-to-video' }, 'vercel-ai-gateway'), true);
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'seedance-lite-t2v' }, 'vercel-ai-gateway'), false);
});

test('vercel gateway catalog stubs are provider-scoped', () => {
  assert.equal(
    isVideoModelVisibleForApiProvider(
      { id: 'vercel-veo-3.1-t2v', generativeProviders: ['vercel-ai-gateway'] },
      'vercel-ai-gateway',
    ),
    true,
  );
  assert.equal(
    isVideoModelVisibleForApiProvider(
      { id: 'vercel-veo-3.1-t2v', generativeProviders: ['vercel-ai-gateway'] },
      'muapi-proxy',
    ),
    false,
  );
});

test('vercel gateway hides extend and tool routes', () => {
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'veo3.1-extend-video' }, 'vercel-ai-gateway'), false);
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'kling-v3.0-std-motion-control' }, 'vercel-ai-gateway'), false);
});
