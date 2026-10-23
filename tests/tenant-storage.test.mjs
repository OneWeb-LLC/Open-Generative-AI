import test from 'node:test';
import assert from 'node:assert/strict';

import {
  tenantStorageScope,
} from '../lib/ogi/tenant-storage.js';
import { muapiStorageKey, apiProviderStorageKey } from '../lib/ogi/constants.js';
import { scopedPersistKey } from '../packages/studio/src/persistKey.js';

test('tenantStorageScope prefers workspace over user', () => {
  assert.equal(
    tenantStorageScope({ workspaceId: 'ws-1', userId: 'u-1' }),
    'ws:ws-1',
  );
  assert.equal(tenantStorageScope({ userId: 'u-1' }), 'user:u-1');
});

test('BYOK storage keys include workspace when set', () => {
  assert.equal(muapiStorageKey('u', 'w'), 'ogi_muapi_key_u_w');
  assert.equal(apiProviderStorageKey('u', 'w'), 'ogi_api_provider_u_w');
});

test('scopedPersistKey differs by workspace scope', () => {
  const base = 'hg_test';
  const key = 'same-api-key';
  const a = scopedPersistKey(base, key, 'ws:a');
  const b = scopedPersistKey(base, key, 'ws:b');
  assert.notEqual(a, b);
});
