import test from 'node:test';
import assert from 'node:assert/strict';

import {
  completionToGenerationPayload,
  studioTypeFromTab,
} from '../lib/ogi/workspace-assets.js';

test('completionToGenerationPayload maps image studio output', () => {
  const payload = completionToGenerationPayload(
    {
      url: 'https://cdn.example/a.png',
      prompt: 'cat',
      model: 'flux',
      type: 'image',
      id: 'abc',
    },
    'image',
  );
  assert.equal(payload.studio_type, 'image');
  assert.equal(payload.media_url, 'https://cdn.example/a.png');
  assert.equal(payload.external_id, 'abc');
  assert.equal(payload.thumbnail_url, 'https://cdn.example/a.png');
});

test('studioTypeFromTab falls back to tab id', () => {
  assert.equal(studioTypeFromTab('lipsync', {}), 'lipsync');
  assert.equal(studioTypeFromTab('video', { type: 'clip' }), 'clip');
});
