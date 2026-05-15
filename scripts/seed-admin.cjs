const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const db = new PrismaClient({ adapter })

async function main() {
  console.log('🔍 Checking for existing admin user...')
  
  const existingAdmin = await db.adminUser.findUnique({
    where: { email: 'admin@gamehub.ai' }
  })
  
  if (existingAdmin) {
    console.log('✅ Admin user already exists:', existingAdmin.email)
    await db.$disconnect()
    process.exit(0)
  }
  
  console.log('📝 Creating default admin user...')
  
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await db.adminUser.create({
    data: {
      email: 'admin@gamehub.ai',
      username: 'admin',
      password_hash: hashedPassword,
      role: 'super_admin',
    }
  })
  
  console.log('✅ Default admin user created successfully!')
  console.log('   Email:', admin.email)
  console.log('   Username:', admin.username)
  console.log('   Role:', admin.role)
  
  await db.$disconnect()
}

main().catch((error) => {
  console.error('❌ Error creating admin user:', error)
  process.exit(1)
})