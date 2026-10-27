import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMuapiPickerCostEstimateParams,
  resolvePickerEntryModelKind,
  snapVideoCostEstimateFields,
} from '../packages/studio/src/utils/muapiVideoCostEstimateParams.js';

test('snapVideoCostEstimateFields coerces invalid Seedance duration for Gemini Omni', () => {
  const snapped = snapVideoCostEstimateFields(
    'gemini-omni-flash-1-1-text-to-video',
    't2v',
    { duration: 5, aspect_ratio: '9:16', resolution: '480p' },
  );
  assert.equal(snapped.duration, 8);
  assert.equal(snapped.aspect_ratio, '9:16');
  assert.equal(snapped.resolution, '720p');
});

test('buildMuapiPickerCostEstimateParams includes model id', () => {
  const params = buildMuapiPickerCostEstimateParams(
    'gemini-omni-flash-1-1-text-to-video',
    't2v',
    { duration: 5, resolution: '480p' },
  );
  assert.equal(params.model, 'gemini-omni-flash-1-1-text-to-video');
  assert.equal(params.duration, 8);
  assert.equal(params.resolution, '720p');
});

test('resolvePickerEntryModelKind prefers t2v on all tab when available', () => {
  const entry = {
    variantsByMode: {
      t2v: { model: { id: 'a-t2v' } },
      i2v: { model: { id: 'a-i2v' } },
    },
  };
  assert.equal(resolvePickerEntryModelKind(entry, 'all', 'i2v'), 't2v');
  assert.equal(resolvePickerEntryModelKind(entry, 'i2v', 't2v'), 'i2v');
});
