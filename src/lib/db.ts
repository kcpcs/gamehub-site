import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    // 远程数据库URL（如 Turso）直接使用
    return process.env.DATABASE_URL;
  }
  
  // 本地/Vercel文件数据库 - 使用绝对路径
  const dbPath = path.join(process.cwd(), 'dev.db');
  return `file:${dbPath}`;
}

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    try {
      const dbUrl = getDatabaseUrl();
      const adapter = new PrismaLibSql({
        url: dbUrl,
      });
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    } catch {
      // Fallback without adapter for build time
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
