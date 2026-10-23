# OWeb satellite onboarding — Open Generative AI

This repo is a **workspace-scoped** OWeb constellation satellite (`app_id`: `open-generative-ai`). Use this checklist when wiring production.

## Prerequisites

- One OS Supabase project `ebjzdcnphkfpxfldnatm` (auth at `https://auth.oweb.one`)
- OWeb control plane with centralized SSO redeem (`POST /api/v1/ecosystem/redeem-launch-token`)
- Register the app in OWeb `ecosystem-apps.ts`: `activationScope: "workspace"`, production `launchUrl`

## Deploy steps

1. **Vercel** — link repo; set env from `.env.example` / `ENV_AUDIT.md` (no service role).
2. **Database** — run migrations under `supabase/migrations/` on One OS.
3. **Smoke** — `npm run smoke:satellite` (static contract checks).
4. **Auth** — verify `/login`, `/sso?launch_token=…`, and `/studio` with `NEXT_PUBLIC_OGI_REQUIRE_AUTH=true`.
5. **Workspace** — sign in with a user in multiple workspaces; switch in Settings; confirm isolated BYOK + studio state.

## Contracts (do not break)

- Browser Supabase session key: `ao-supabase-auth` (`lib/supabase/client.js`)
- SSO redeem: satellite `POST /api/sso/redeem` → OWeb only (no `SUPABASE_SERVICE_ROLE_KEY` on satellite)
- Post-login: `POST /api/auth/complete` → `establishProductSession` (`lib/workspace/session.server.js`)

Canonical upstream docs (private OWeb repo): `docs/SATELLITE_ONBOARDING_KIT.md`, `docs/SATELLITE_AUTH_RETURN.md`.
