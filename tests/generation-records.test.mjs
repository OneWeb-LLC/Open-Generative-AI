import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generationRowToHistoryEntry,
  normalizeGenerationInsert,
} from '../lib/ogi/generation-records.js';

test('generationRowToHistoryEntry maps server row to studio history', () => {
  const entry = generationRowToHistoryEntry(
    {
      id: '11111111-1111-1111-1111-111111111111',
      external_id: 'req-1',
      media_url: 'https://cdn.example/v.mp4',
      prompt: 'A cat',
      model: 'veo-2',
      metadata: { costUsd: 0.12 },
      created_at: '2026-10-23T10:00:00.000Z',
    },
    { userId: 'u1', oneId: '@creator', displayName: 'Creator' },
  );

  assert.equal(entry.url, 'https://cdn.example/v.mp4');
  assert.equal(entry.recordId, '11111111-1111-1111-1111-111111111111');
  assert.equal(entry.id, 'req-1');
  assert.equal(entry.creator.oneId, '@creator');
});

test('normalizeGenerationInsert rejects missing media', () => {
  const result = normalizeGenerationInsert(
    { studio_type: 'video' },
    { workspaceId: 'ws', userId: 'u' },
  );
  assert.equal(result.error, 'missing_fields');
});
