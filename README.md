# Repo1

Next.js consumer app for [venky-core](https://github.com/uv-venky/venky-core).

**Pinned release:** [v0.4.1](https://github.com/uv-venky/venky-core/releases/tag/v0.4.1)

## Prerequisites

- Node.js >= 24.13.0
- pnpm 11.x
- PostgreSQL with the venky-core schema (`VENKY_PG_SEARCH_PATH=core,public`)

## Install and run

```bash
cp .env.example .env.local
# Edit DATABASE_URL and AUTH_SECRET

pnpm install   # builds venky-core dist + copies migrations
pnpm migrate
pnpm dev
```

`postinstall` will:

1. Run `pnpm build` inside `node_modules/venky-core` if `dist/` is missing (GitHub installs do not include built output)
2. Copy SQL migrations from venky-core into `./migrations`

## Local venky-core development (optional)

To work on the library and app side-by-side, replace the dependency in `package.json`:

```json
"venky-core": "link:../venky-core"
```

Then build the sibling checkout:

```bash
cd ../venky-core
pnpm install
pnpm build
cd ../repo1
pnpm install
pnpm dev
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Session signing secret |
| `VENKY_PG_SEARCH_PATH` | Postgres `search_path` (default: `core,public`) |

See `.env.example` for a starter template.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm typecheck` | TypeScript check |
| `pnpm migrate` | Run database migrations |

## Project layout

- `src/lib/server/init/` — server bootstrap and `ServerConfig`
- `src/components/sidebar/moduleIndex.ts` — sidebar teams/modules
- `src/app/(secure)/` — authenticated routes wrapping venky-core pages
- `src/app/api/` — API routes delegating to venky-core handlers
- `config/default.yml` — app id, feature flags, init admin user
