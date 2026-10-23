#!/usr/bin/env node
/**
 * Copy whitelisted env vars from the oweb Vercel project into open-generative-ai.
 * Uses @vercel/sdk (VERCEL_TOKEN required). Never copies SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage:
 *   VERCEL_TOKEN=... npm run sync:vercel-env
 * Optional:
 *   OWEB_VERCEL_PROJECT=oweb
 *   OGI_VERCEL_PROJECT=open-generative-ai
 *   VERCEL_TEAM_ID=team_...
 */

import { Vercel } from '@vercel/sdk';

const SOURCE_PROJECT = process.env.OWEB_VERCEL_PROJECT || 'oweb';
const TARGET_PROJECT = process.env.OGI_VERCEL_PROJECT || 'open-generative-ai';
const TEAM_ID =
  process.env.VERCEL_TEAM_ID || process.env.VERCEL_ORG_ID || 'team_Na274IDFwAHRPi5JdFrzvRUk';
const TEAM_SLUG = process.env.VERCEL_TEAM_SLUG || 'oweb';

/** Keys safe to mirror from oweb → OGI satellite (no service role). */
const COPY_KEYS = [
  'SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_PROJECT_ID',
  'NEXT_PUBLIC_OWEB_APP_URL',
  'NEXT_PUBLIC_OWEB_PLATFORM_API_URL',
  'NEXT_PUBLIC_OWEB_ORIGIN',
  'NEXT_PUBLIC_OWEB_AUTH_HOST',
  'NEXT_PUBLIC_OWEB_APP_ID',
  'MUAPI_UPSTREAM',
  'AI_GATEWAY_API_KEY',
  'VERCEL_AI_GATEWAY_API_KEY',
  'OGI_ENABLE_VERCEL_VIDEO_PROVIDER',
  'NEXT_PUBLIC_OGI_ENABLE_VERCEL_VIDEO_PROVIDER',
  'RUNPOD_API_KEY',
  'RUNPOD_COMFY_VIDEO_ENDPOINT_ID',
  'OGI_ENABLE_COMFY_RUNPOD_PROVIDER',
  'NEXT_PUBLIC_OGI_ENABLE_COMFY_RUNPOD_PROVIDER',
];

/** Same key on source/target; skipped when Vercel marks them write-only (visibility: secret). */
const COPY_SECRET_KEYS = ['MUAPI_KEY'];

/** Map oweb secret → satellite server env for optional extra API provider. */
const RENAME_KEYS = {
  BACKEND_API_URL: 'OGI_OWEB_BACKEND_API_UPSTREAM',
};

const BLOCKED = new Set(['SUPABASE_SERVICE_ROLE_KEY']);

function teamFields() {
  if (TEAM_ID) return { teamId: TEAM_ID };
  if (TEAM_SLUG) return { slug: TEAM_SLUG };
  return {};
}

async function listProjectEnvs(vercel, projectIdOrName) {
  const res = await vercel.projects.filterProjectEnvs({
    idOrName: projectIdOrName,
    decrypt: 'true',
    ...teamFields(),
  });
  return res?.envs ?? [];
}

async function resolveGatewayEnvValue(vercel, projectIdOrName, env) {
  if (!env?.id) return env?.value ?? null;
  let value = env.value;
  if (value && !value.startsWith('eyJ')) return value;
  try {
    const detail = await vercel.projects.getProjectEnv({
      idOrName: projectIdOrName,
      id: env.id,
      ...teamFields(),
    });
    value = detail?.value ?? value;
  } catch {
    /* keep list value */
  }
  return value;
}

async function upsertEnv(vercel, projectIdOrName, entry) {
  await vercel.projects.createProjectEnv({
    idOrName: projectIdOrName,
    upsert: 'true',
    ...teamFields(),
    requestBody: entry,
  });
}

async function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error('VERCEL_TOKEN is required');
    process.exit(1);
  }

  const vercel = new Vercel({ bearerToken: token });
  const sourceEnvs = await listProjectEnvs(vercel, SOURCE_PROJECT);

  const byKey = new Map();
  for (const env of sourceEnvs) {
    if (!env?.key || BLOCKED.has(env.key)) continue;
    if (!byKey.has(env.key)) byKey.set(env.key, env);
  }

  let copied = 0;
  for (const key of COPY_KEYS) {
    const env = byKey.get(key);
    if (!env?.value && !key.includes('GATEWAY')) continue;
    let value =
      key.includes('GATEWAY') && env
        ? await resolveGatewayEnvValue(vercel, SOURCE_PROJECT, env)
        : env?.value;
    if (!value) continue;
    let type = env.type === 'encrypted' ? 'encrypted' : 'plain';
    if (key.includes('GATEWAY') && value.startsWith('eyJ')) {
      console.warn(
        `skip ${key}: decrypted value looks like Vercel ciphertext, not a gateway API key (use vck_… from project env GET)`,
      );
      continue;
    }
    if (key.includes('GATEWAY') && value.startsWith('vck_')) {
      type = 'sensitive';
    }
    await upsertEnv(vercel, TARGET_PROJECT, {
      key,
      value,
      type,
      target: env.target?.length ? env.target : ['production', 'preview', 'development'],
      comment: `Synced from ${SOURCE_PROJECT} (${key})`,
    });
    copied += 1;
    console.log(`synced ${key}`);
  }

  for (const key of COPY_SECRET_KEYS) {
    const env = byKey.get(key);
    if (!env?.value) {
      console.warn(
        `skip ${key}: not readable from ${SOURCE_PROJECT} (Vercel write-only secret — paste manually on ${TARGET_PROJECT})`,
      );
      continue;
    }
    await upsertEnv(vercel, TARGET_PROJECT, {
      key,
      value: env.value,
      type: 'sensitive',
      target: ['production', 'preview'],
      comment: `Synced from ${SOURCE_PROJECT}/${key}`,
    });
    copied += 1;
    console.log(`synced ${key}`);
  }

  for (const [sourceKey, targetKey] of Object.entries(RENAME_KEYS)) {
    const env = byKey.get(sourceKey);
    if (!env?.value) {
      console.warn(
        `skip ${targetKey}: ${sourceKey} not available (set manually in Vercel if needed)`,
      );
      continue;
    }
    await upsertEnv(vercel, TARGET_PROJECT, {
      key: targetKey,
      value: env.value,
      type: 'encrypted',
      target: ['production', 'preview'],
      comment: `Mapped from ${SOURCE_PROJECT}/${sourceKey} for oweb-backend API provider`,
    });
    copied += 1;
    console.log(`synced ${sourceKey} → ${targetKey}`);
  }

  console.log(`Done. ${copied} variable(s) upserted on ${TARGET_PROJECT}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
