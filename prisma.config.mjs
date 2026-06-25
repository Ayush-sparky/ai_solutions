import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 config. Connection URLs live here (no longer in schema.prisma).
// Docs: https://pris.ly/d/prisma-config
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma Migrate / introspection / CLI use the DIRECT (unpooled) Neon
    // connection. In Prisma 7 this is the equivalent of the old `directUrl`.
    // The app's runtime connection (pooled DATABASE_URL) is configured via the
    // driver adapter in lib/prisma.js instead.
    url: process.env.DIRECT_URL,
  },
});
