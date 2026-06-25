import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires a driver adapter at runtime. We connect through the POOLED
// Neon connection (DATABASE_URL) via node-postgres. Migrations use DIRECT_URL
// (configured in prisma.config.mjs) instead.
const adapter = new PrismaPg(process.env.DATABASE_URL);

// Reuse a single PrismaClient across hot-reloads in development to avoid
// exhausting database connections.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
