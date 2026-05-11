import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | null {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // Vercel 构建时 process.cwd() 是 /vercel/path0
  // 运行时 process.cwd() 是 /var/task
  // dev.db 应该在这两个位置之一
  return 'file:./dev.db';
}

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const dbUrl = getDatabaseUrl();
    if (dbUrl) {
      try {
        const adapter = new PrismaLibSql({ url: dbUrl });
        globalForPrisma.prisma = new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
      } catch (err) {
        console.error('[DB] Failed to initialize with adapter:', err);
        globalForPrisma.prisma = new PrismaClient({
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
      }
    } else {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
  }
  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
