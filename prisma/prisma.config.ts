import { defineConfig } from '@prisma/client'

export default defineConfig({
  datasources: {
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./dev.db',
      shadowDatabaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
    },
  },
  generator: {
    client: {
      provider: 'prisma-client-js',
    },
  },
})
