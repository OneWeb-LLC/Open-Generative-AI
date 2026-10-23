/**
 * Static satellite readiness smoke (no network).
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

const envExample = readFileSync(resolve(root, '.env.example'), 'utf8');
assert(
  !envExample.includes('SUPABASE_SERVICE_ROLE_KEY'),
  'env.example must not require SUPABASE_SERVICE_ROLE_KEY (centralized OWeb redeem)',
);
assert(envExample.includes('NEXT_PUBLIC_OGI_REQUIRE_AUTH=true'), 'env.example must document REQUIRE_AUTH');
assert(envExample.includes('ebjzdcnphkfpxfldnatm'), 'env.example must pin One OS project id');
assert(envExample.includes('auth.oweb.one'), 'env.example must use auth.oweb.one');
assert(
  envExample.includes('NEXT_PUBLIC_OWEB_PLATFORM_API_URL'),
  'env.example must document OWeb platform API for SSO redeem',
);

assert(existsSync(resolve(root, 'docs/SATELLITE.md')), 'missing docs/SATELLITE.md');
const satelliteDoc = readFileSync(resolve(root, 'docs/SATELLITE.md'), 'utf8');
assert(satelliteDoc.includes('https://artemiis.one'), 'SATELLITE.md must document production origin artemiis.one');
assert(
  existsSync(resolve(root, 'supabase/migrations/20261007220000_ogi_profiles_isolation.sql')),
  'missing ogi_profiles migration',
);
assert(
  existsSync(resolve(root, 'supabase/migrations/20261022230000_ogi_workspace_tenant_isolation.sql')),
  'missing ogi_workspace_preferences migration',
);
assert(
  existsSync(resolve(root, 'supabase/migrations/20261023120000_ogi_team_generations.sql')),
  'missing ogi_team_generations migration',
);
assert(
  existsSync(resolve(root, 'app/api/workspace/generations/route.js')),
  'missing workspace generations API',
);
assert(
  existsSync(resolve(root, 'app/api/workspace/switch/route.js')),
  'missing workspace switch API',
);

const constants = readFileSync(resolve(root, 'lib/ogi/constants.js'), 'utf8');
assert(constants.includes("OGI_APP_ID = 'open-generative-ai'"), 'app id must be open-generative-ai');
assert(constants.includes('ao-supabase-auth'), 'shared session key ao-supabase-auth required');

const client = readFileSync(resolve(root, 'lib/supabase/client.js'), 'utf8');
assert(
  client.includes('SUPABASE_AUTH_STORAGE_KEY') || client.includes('ao-supabase-auth'),
  'browser client must use shared ao-supabase-auth storage key',
);

const redeem = readFileSync(resolve(root, 'lib/sso/redeem-launch-token.server.js'), 'utf8');
const redeemContract = readFileSync(resolve(root, 'lib/sso/redeem-contract.js'), 'utf8');
assert(
  redeemContract.includes('/ecosystem/redeem-launch-token'),
  'SSO redeem must call OWeb centralized endpoint',
);
assert(
  redeem.includes('getOwebRedeemLaunchUrl') && redeem.includes('app_id: OGI_APP_ID'),
  'SSO redeem server must POST launch_token and app_id to OWeb',
);
assert(
  !redeem.includes('ao_ecosystem_launch_tokens') && !redeem.includes('getSupabaseAdmin'),
  'SSO redeem must not use direct token table access or service-role client',
);

assert(
  !existsSync(resolve(root, 'lib/supabase/admin.server.js')),
  'admin service-role client must be removed from satellite',
);

const isolationSql = readFileSync(
  resolve(root, 'supabase/migrations/20261007220000_ogi_profiles_isolation.sql'),
  'utf8',
);
assert(isolationSql.includes('FORCE ROW LEVEL SECURITY'), 'ogi migration must FORCE RLS');
assert(
  !/CREATE\s+(OR\s+REPLACE\s+)?FUNCTION\s+public\.ogi_is_workspace_member/i.test(
    isolationSql,
  ),
  'ogi migration must not create SECURITY DEFINER workspace helpers',
);
assert(
  isolationSql.includes('(SELECT auth.uid()) = id'),
  'ogi_profiles_self must compare auth.uid() to id',
);

if (failures.length) {
  console.error('smoke:satellite FAILED');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}

console.log('smoke:satellite OK');
