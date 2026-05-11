import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

async function checkPerformance() {
  console.log('⚡ GameHub 性能检查')
  console.log('=' .repeat(60))

  const baseUrl = 'http://localhost:3000'
  
  const endpoints = [
    '/',
    '/guides',
    '/games/genshin-impact',
    '/codes/genshin-impact',
    '/tier-list/valorant',
  ]

  console.log('📡 测试页面加载时间...')
  console.log()

  for (const endpoint of endpoints) {
    const url = baseUrl + endpoint
    const startTime = Date.now()
    
    try {
      const response = await fetch(url)
      const responseTime = Date.now() - startTime
      
      console.log(`🔗 ${endpoint}`)
      console.log(`   状态: ${response.status} ${response.statusText}`)
      console.log(`   响应时间: ${responseTime}ms`)
      
      const content = await response.text()
      console.log(`   页面大小: ${(content.length / 1024).toFixed(1)} KB`)
      console.log()
      
    } catch (error) {
      console.log(`❌ ${endpoint}`)
      console.log(`   错误: ${error}`)
      console.log()
    }
  }

  console.log('✅ 性能检查完成!')
}

checkPerformance().catch(console.error)
