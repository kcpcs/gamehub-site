import dotenv from 'dotenv'
import { testJiekouConnection, generateArticle } from './jiekou-api'

dotenv.config({ path: '.env.local' })

async function runTests() {
  console.log('🚀 GameHub jiekou.ai 配置测试')
  console.log('=' .repeat(50))

  const JIEKOU_API_KEY = process.env.JIEKOU_API_KEY

  if (!JIEKOU_API_KEY) {
    console.error('❌ JIEKOU_API_KEY 未配置')
    console.log('\n📝 请在 .env.local 中添加：')
    console.log('JIEKOU_API_KEY="your-api-key-from-jiekou.ai"')
    console.log('JIEKOU_API_URL="https://api.jiekou.ai/v1/chat/completions"')
    process.exit(1)
  }

  console.log('✅ JIEKOU_API_KEY 已配置')

  console.log('\n🔍 测试API连接...')
  const connectionOk = await testJiekouConnection()

  if (!connectionOk) {
    console.log('\n❌ API连接失败')
    process.exit(1)
  }

  console.log('\n🧪 测试内容生成...')
  const article = await generateArticle('原神', '新手入门攻略')

  if (article) {
    console.log('✅ 内容生成测试成功！')
    console.log('📝 生成结果：')
    console.log(`   标题：${article.title}`)
    console.log(`   摘要：${article.excerpt}`)
    console.log(`   关键词：${article.seoKeywords.join(', ')}`)
    console.log(`   内容长度：${article.content.length} 字`)
  } else {
    console.log('⚠️ 内容生成测试有问题')
  }

  console.log('\n' + '=' .repeat(50))
  console.log('✅ 测试完成！')
}

runTests().catch(console.error)
