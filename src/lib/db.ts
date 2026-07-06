import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Connection Verification helper
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    // console.log("Database Connection Verification: SUCCESSFUL");
    return true;
  } catch (error) {
    console.error("Database Connection Verification: FAILED", error);
    return false;
  }
}
