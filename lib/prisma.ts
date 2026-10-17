import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

function stripSslMode(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("sslmode");
    return u.toString();
  } catch {
    return url;
  }
}

function createClient() {
  if (DATABASE_URL?.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: DATABASE_URL }).$extends(withAccelerate());
  }
  const pool = new Pool({ connectionString: DATABASE_URL ? stripSslMode(DATABASE_URL) : undefined, ssl: { rejectUnauthorized: true } });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = (globalThis.prisma ?? createClient()) as unknown as PrismaClient;

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export default prisma;
