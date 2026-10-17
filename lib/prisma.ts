import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

function createClient(): PrismaClient {
  if (DATABASE_URL?.startsWith("prisma+postgres://")) {
    return new PrismaClient();
  }
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? createClient();

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export default prisma;
