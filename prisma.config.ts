import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

// Prisma CLI runs outside Next.js, so we load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') }) // fallback

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    seed: 'node ./prisma/seed.cjs',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
