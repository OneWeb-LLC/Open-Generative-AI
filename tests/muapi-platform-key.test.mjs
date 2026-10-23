import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PLATFORM_MANAGED_MUAPI_KEY,
  isPlatformManagedMuapiKey,
  normalizeMuapiClientKey,
} from '../lib/ogi/muapi-client.js';

test('platform managed sentinel is recognized', () => {
  assert.equal(isPlatformManagedMuapiKey(PLATFORM_MANAGED_MUAPI_KEY), true);
  assert.equal(isPlatformManagedMuapiKey('real-key'), false);
});

test('normalizeMuapiClientKey drops empty and platform sentinel', () => {
  assert.equal(normalizeMuapiClientKey(''), null);
  assert.equal(normalizeMuapiClientKey(PLATFORM_MANAGED_MUAPI_KEY), null);
  assert.equal(normalizeMuapiClientKey('  abc  '), 'abc');
});

test('resolveMuapiApiKeyFromRequest prefers client key over env', async () => {
  const prev = process.env.MUAPI_KEY;
  process.env.MUAPI_KEY = 'platform-secret';
  const { resolveMuapiApiKeyFromRequest } = await import(
    '../lib/ogi/muapi-api-key.server.js'
  );

  const withHeader = new Request('https://example.com', {
    headers: { 'x-api-key': 'user-byok' },
  });
  assert.equal(resolveMuapiApiKeyFromRequest(withHeader), 'user-byok');

  const withoutHeader = new Request('https://example.com');
  assert.equal(resolveMuapiApiKeyFromRequest(withoutHeader), 'platform-secret');

  process.env.MUAPI_KEY = prev;
});
