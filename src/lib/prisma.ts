import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

<<<<<<< HEAD
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
=======
function getDatabaseUrl() {
  const value = process.env.DATABASE_URL?.trim();

  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (
      url.hostname.endsWith(".neon.tech") &&
      !url.searchParams.has("connect_timeout")
    ) {
      url.searchParams.set("connect_timeout", "30");
    }

    return url.toString();
  } catch {
    return value;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
>>>>>>> 2090a59 (new changes)
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
