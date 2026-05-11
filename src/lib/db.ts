import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function findDbFile(): string | null {
  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(process.cwd(), 'dev.db'),
    path.join(__dirname, '..', '..', '..', 'dev.db'), // src/lib/../../dev.db
    path.join('/var/task', 'dev.db'), // Vercel 默认路径
    path.join('/vercel/path0', 'dev.db'), // Vercel 构建路径
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log('[DB] Found database at:', p);
      return p;
    }
  }

  console.log('[DB] Database file not found in any known location');
  return null;
}

function getDatabaseUrl(): string | null {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  const dbFile = findDbFile();
  if (!dbFile) return null;
  return `file:${dbFile}`;
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
      console.error('[DB] No database URL available, using PrismaClient without adapter');
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
