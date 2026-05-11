import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

async function findApiUrl() {
  const JIEKOU_API_KEY = process.env.JIEKOU_API_KEY

  if (!JIEKOU_API_KEY) {
    console.error('❌ API密钥未配置')
    return
  }

  const possibleUrls = [
    'https://api.jiekou.ai/v1/chat/completions',
    'https://api.jiekou.ai/api/chat/completions',
    'https://api.jiekou.ai/chat/completions',
    'https://jiekou.ai/api/v1/chat/completions',
    'https://jiekou.ai/v1/chat/completions',
    'https://api.jiekou.ai/generate',
    'https://api.jiekou.ai/completions',
    'https://api.jiekou.ai/v1/completions',
  ]

  console.log('🔍 尝试不同的API端点...')
  console.log('=' .repeat(50))

  for (const url of possibleUrls) {
    try {
      console.log(`尝试: ${url}`)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JIEKOU_API_KEY}`
        },
        body: JSON.stringify({
          model: 'google-gemma-3-12b-it',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 10
        })
      })

      console.log(`   状态: ${response.status}`)
      
      if (response.status === 200) {
        const text = await response.text()
        console.log(`   ✅ 成功! 响应长度: ${text.length}`)
        console.log(`   响应: ${text.substring(0, 200)}...`)
        return url
      } else {
        const text = await response.text()
        console.log(`   ❌ 失败: ${text}`)
      }

    } catch (error) {
      console.log(`   ⚠️ 错误: ${error}`)
    }
  }

  console.log('\n❌ 未找到可用的API端点')
  console.log('\n📝 请登录 jiekou.ai 查看正确的API文档')
}

findApiUrl().catch(console.error)
