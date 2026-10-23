import assert from 'node:assert/strict';
import test from 'node:test';

test('isOwebBillingEnabled respects explicit flag', async () => {
  const { isOwebBillingEnabled } = await import('../lib/ogi/oweb-billing.server.js');

  const prevPublic = process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING;
  const prevUpstream = process.env.OGI_OWEB_STUDIO_UPSTREAM;

  delete process.env.OGI_OWEB_STUDIO_UPSTREAM;
  delete process.env.OGI_OWEB_BACKEND_API_UPSTREAM;

  process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING = 'true';
  assert.equal(isOwebBillingEnabled(), true);

  process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING = 'false';
  assert.equal(isOwebBillingEnabled(), false);

  delete process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING;
  process.env.OGI_OWEB_STUDIO_UPSTREAM = 'https://oweb.one/api/studio/generative';
  assert.equal(isOwebBillingEnabled(), true);

  if (prevPublic !== undefined) process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING = prevPublic;
  else delete process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING;
  if (prevUpstream !== undefined) process.env.OGI_OWEB_STUDIO_UPSTREAM = prevUpstream;
  else delete process.env.OGI_OWEB_STUDIO_UPSTREAM;
});

test('oweb-wallet provider is default when billing enabled', async () => {
  const prev = process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING;
  process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING = 'true';

  const { getDefaultApiProviderId, getPublicApiProviders } = await import(
    '../lib/ogi/api-providers.js'
  );
  const providers = getPublicApiProviders();
  assert.ok(providers.some((p) => p.id === 'oweb-wallet' && p.mode === 'oweb-studio'));
  assert.equal(getDefaultApiProviderId(), 'oweb-wallet');

  if (prev !== undefined) process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING = prev;
  else delete process.env.NEXT_PUBLIC_OGI_USE_OWEB_BILLING;
});
