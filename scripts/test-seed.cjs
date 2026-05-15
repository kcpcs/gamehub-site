const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
require('dotenv').config()

async function testConnection() {
  try {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    })
    const db = new PrismaClient({ adapter })
    
    await db.$connect()
    console.log('Connected to database')
    
    const tables = await db.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`
    console.log('Tables:', tables)
    
    await db.$disconnect()
  } catch (error) {
    console.error('Error:', error)
  }
}

testConnection()