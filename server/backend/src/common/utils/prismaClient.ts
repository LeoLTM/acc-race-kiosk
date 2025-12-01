import { PrismaClient } from "@/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Create adapter with database URL from environment
const adapter = new PrismaLibSql({
	url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

// Prevent multiple instances of Prisma Client in development due to hot-reloading
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
