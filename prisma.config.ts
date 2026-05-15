import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: 'node ./prisma/seed.cjs',
  },
})