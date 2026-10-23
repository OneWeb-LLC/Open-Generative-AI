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

test('vercel gateway shows mapped models only', () => {
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'veo-3.1' }, 'vercel-ai-gateway'), true);
  assert.equal(isVideoModelVisibleForApiProvider({ id: 'seedance-lite-t2v' }, 'vercel-ai-gateway'), false);
});
