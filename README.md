# Repo1

Reference **consumer application** for [venky-core](https://github.com/uv-venky/venky-core).

**Pinned release:** [v0.4.3](https://github.com/uv-venky/venky-core/releases/tag/v0.4.3)

## Documentation

Full setup instructions live in the venky-core repo:

**[venky-core/CONSUMER.md](https://github.com/uv-venky/venky-core/blob/main/CONSUMER.md)**

## Quick start

```bash
cp .env.example .env
# Edit DATABASE_URL and AUTH_SECRET

pnpm install
pnpm migrate
pnpm dev
```

Default admin credentials are in `config/default.yml` (`init.admin`).
