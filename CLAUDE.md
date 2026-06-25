# AI-Solutions

Marketing + inquiry website for a startup called **AI-Solutions**.

The product is two surfaces in one app:

1. **Public site** — marketing pages (services, about, etc.) and a public
   **inquiry form** where prospective customers submit leads.
2. **Secure admin dashboard** — an authenticated, access-controlled area where
   staff review submitted inquiries and manage site content. Everything under
   the admin surface must be protected; never expose admin data or actions to
   unauthenticated users.

## Tech stack

| Concern      | Choice                                                      |
| ------------ | ---------------------------------------------------------- |
| Framework    | Next.js 16 (App Router)                                     |
| Language     | **JavaScript only — do NOT add TypeScript** (`.js`/`.jsx`/`.mjs`) |
| Styling      | Tailwind CSS v4 (PostCSS, no `tailwind.config.js`)         |
| Linting      | ESLint 9 (flat config in `eslint.config.mjs`)             |
| ORM          | Prisma 7                                                    |
| Database     | PostgreSQL on **Neon** (serverless Postgres)               |
| DB driver    | `pg` via the `@prisma/adapter-pg` driver adapter           |

> **Heads up:** this is Next.js **16**, which has breaking changes vs. earlier
> versions. See [AGENTS.md](AGENTS.md) and the bundled guides in
> `node_modules/next/dist/docs/` before writing Next.js code.

## Project layout

```
app/                  # App Router routes, layouts, server components
lib/prisma.js         # Shared PrismaClient singleton (import via "@/lib/prisma")
prisma/schema.prisma  # Prisma schema (models + datasource provider)
prisma.config.mjs     # Prisma 7 config: schema path, migrations, datasource URL
.env                  # Secrets (gitignored) — connection strings, etc.
.env.example          # Committed template for .env
```

Path alias: `@/*` maps to the project root (e.g. `import { prisma } from "@/lib/prisma"`).

## Database & Prisma 7 notes

Prisma 7 changed how connections are configured — this is **different from older
tutorials**, so keep it in mind:

- **Connection URLs are NOT in `schema.prisma`.** The `datasource` block only
  declares `provider = "postgresql"`. The old `url` / `directUrl` schema fields
  no longer exist in Prisma 7.
- **Migrations / CLI** read the datasource URL from `prisma.config.mjs`, which
  uses **`DIRECT_URL`** (the direct, unpooled Neon connection). This is the
  Prisma 7 equivalent of the old `directUrl`.
- **Runtime** connects through a **driver adapter** (`@prisma/adapter-pg`) in
  `lib/prisma.js`, using the **pooled** `DATABASE_URL`. Always import the shared
  client from `@/lib/prisma` — do not call `new PrismaClient()` elsewhere.
- The generated client lives in `node_modules/@prisma/client` (legacy
  `prisma-client-js` generator) and is imported as `@prisma/client`. Run
  `prisma generate` after changing the schema.

### Environment variables (`.env`, gitignored)

| Var            | Connection           | Used by                                  |
| -------------- | -------------------- | ---------------------------------------- |
| `DATABASE_URL` | pooled (`-pooler`)   | App runtime (driver adapter)             |
| `DIRECT_URL`   | direct / unpooled    | Prisma Migrate & CLI (`prisma.config.mjs`) |

Copy `.env.example` to `.env` and fill in real Neon values. Never commit `.env`.

## Common commands

```bash
npm run dev            # Start the dev server
npm run build          # Production build
npm run start          # Run the production build
npm run lint           # ESLint

npx prisma generate    # Regenerate the client after schema changes
npx prisma migrate dev # Create & apply a migration (uses DIRECT_URL)
npx prisma studio      # Browse the database
```

## Conventions

- JavaScript only — if a tool tries to introduce TypeScript (e.g. a `.ts`
  generated file or `tsconfig.json`), prefer the JS-emitting option instead.
- App Router with Server Components by default; add `"use client"` only when a
  component needs interactivity.
- Treat the admin dashboard as security-sensitive: gate every admin route and
  server action behind authentication/authorization.
