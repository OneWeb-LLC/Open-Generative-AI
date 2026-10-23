# Environment Variable Audit — Open Generative AI (OWeb satellite)

**Supabase project:** `ebjzdcnphkfpxfldnatm` (One OS)  
**Auth URL:** `https://auth.oweb.one`  
**App id:** `open-generative-ai`

## Required (production)

| Variable | Client | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | One OS Supabase URL (`https://auth.oweb.one`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Anon/publishable key |
| `NEXT_PUBLIC_OWEB_APP_URL` | yes | `https://oweb.one` (Continue with OWeb) |
| `NEXT_PUBLIC_OWEB_PLATFORM_API_URL` | yes | `https://oweb.one/api/v1` — centralized SSO redeem |
| `NEXT_PUBLIC_APP_URL` | yes | Satellite origin — production **`https://artemiis.one`** (`APP_URL` should match) |

## Recommended

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_OGI_REQUIRE_AUTH` | `true` in production (middleware protects `/studio`) |
| `SUPABASE_URL` | Server alias for URL (optional if `NEXT_PUBLIC_*` set) |

## OWeb workspace billing (production satellite)

| Variable | Client | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_OGI_USE_OWEB_BILLING` | yes | `true` — studio uses OWeb OneCredits (`oweb-wallet` provider) |
| `OGI_OWEB_STUDIO_UPSTREAM` | no | OWeb hosted generative base (default `{NEXT_PUBLIC_OWEB_APP_URL}/api/studio/generative`) |
| `NEXT_PUBLIC_OGI_OWEB_WALLET_LABEL` | yes | Settings label for wallet provider |

Wallet balance: satellite `GET /api/ogi/wallet` reads `ao_orgs.credits_balance` for the active workspace cookie. Generations: browser → `/api/oweb-studio/generative/*` → OWeb (Bearer JWT + `x-org-id`).

## Generative API providers (studio UI)

| Variable | Client | Purpose |
|----------|--------|---------|
| `MUAPI_KEY` | no | Shared MuAPI access key for your deployment (skips studio BYOK modal; injected on server proxies) |
| `MUAPI_UPSTREAM` | no | Upstream for `/api/muapi` proxy (default `https://api.muapi.ai`) |
| `OGI_OWEB_BACKEND_API_UPSTREAM` | no | Optional OWeb `BACKEND_API_URL` mirror → **OWeb backend API** in UI |
| `NEXT_PUBLIC_OGI_DEFAULT_API_PROVIDER` | yes | Default selection (`muapi-proxy`, `muapi-direct`, …) |
| `NEXT_PUBLIC_OGI_OWEB_BACKEND_LABEL` | yes | Label for OWeb backend provider |
| `OGI_CUSTOM_API_UPSTREAM` | no | Optional third upstream |
| `NEXT_PUBLIC_OGI_CUSTOM_API_LABEL` | yes | Label for custom provider |

Sync Supabase/OWeb public env from the **oweb** Vercel project: `VERCEL_TOKEN=… npm run sync:vercel-env` (never copies service role).

## Explicitly not used

- **No `SUPABASE_SERVICE_ROLE_KEY`** — SSO launch tokens are redeemed via OWeb `POST /api/v1/ecosystem/redeem-launch-token` (satellite server calls OWeb; OWeb uses service role centrally).
- No second Supabase project
- With OWeb billing on, studio uses the workspace OneCredits wallet (OWeb hosts metering). With billing off, optional server `MUAPI_KEY` or BYOK per user per workspace in browser storage.
- No Clerk / app-local password store

Apply DB migrations in `supabase/migrations/` on One OS before profile upsert and workspace preferences in production.

**Note:** Centralized redeem requires OWeb PR #57 deployed to production before SSO return works end-to-end.
