# Open Generative AI — OWeb satellite

`app_id`: **open-generative-ai**  
Activation scope: **workspace**  
Auth host: **https://auth.oweb.one**  
Control plane: **https://oweb.one**

This deployment is an OWeb constellation satellite. Identity, workspaces, and billing stay on One OS — this app does not operate a second auth or Supabase project.

## Auth flows

| Path | Entry | Notes |
|------|--------|--------|
| Native | `/login` | Email/password against shared Supabase Auth (`ao-supabase-auth` session key) |
| OWeb return | `https://oweb.one/login?launch=open-generative-ai` | App Store mints token → `/sso?launch_token=…` |
| SSO redeem | `/sso` | Satellite `POST /api/sso/redeem` → OWeb `POST /api/v1/ecosystem/redeem-launch-token`, then `setSession` |

Post-auth (native or SSO): server resolves workspace context, calls OWeb activation APIs (with RPC fallback), upserts `ogi_profiles`.

## Multi-tenant isolation (workspace scope)

Each OWeb **workspace** (`ao_orgs`) is a tenant. The active workspace is stored in the `ogi_workspace_id` httpOnly cookie and surfaced in Settings via the workspace switcher (`POST /api/workspace/switch`).

| Layer | Isolation |
|-------|-----------|
| Identity / billing | One OS (shared Supabase Auth, `ao_org_members`) |
| BYOK MuAPI keys | Browser storage keyed by `userId` + `workspaceId` |
| Studio drafts/history | `localStorage` scoped per workspace (`storageScope` on studio components) |
| Server preferences | `ogi_workspace_preferences` — RLS via inline `ao_org_members` membership |

## Environment

See `.env.example` and `ENV_AUDIT.md`. Never commit service role keys.

## Schema

Apply all SQL in `supabase/migrations/` on the shared One OS project (profiles + workspace preferences).

## Control-plane registration (separate PR)

Register `open-generative-ai` in OWeb `ecosystem-apps.ts` with `activationScope: "workspace"` and production `launchUrl` before marking the app live in the App Store.

Canonical contracts: OneWeb-LLC/oweb `docs/SATELLITE_ONBOARDING_KIT.md`, `docs/SATELLITE_AUTH_RETURN.md`.
