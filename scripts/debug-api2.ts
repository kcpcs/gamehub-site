import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

async function debugApi() {
  const JIEKOU_API_KEY = process.env.JIEKOU_API_KEY

  if (!JIEKOU_API_KEY) {
    console.error('❌ API密钥未配置')
    return
  }

  const possibleUrls = [
    'https://api.jiekou.ai/openai/v1/chat/completions',
    'https://api.jiekou.ai/openai',
    'https://api.jiekou.ai/anthropic/v1/messages',
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
          model: 'claude-opus-4-7',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 10
        })
      })

      console.log(`   状态: ${response.status}`)
      
      if (response.status === 200) {
        const text = await response.text()
        console.log(`   ✅ 成功! 响应长度: ${text.length}`)
        console.log(`   响应: ${text.substring(0, 200)}...`)
        
        try {
          const json = JSON.parse(text)
          console.log(`   解析成功!`)
          console.log(JSON.stringify(json, null, 2))
        } catch {
          console.log(`   JSON解析失败`)
        }
        
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
}

debugApi().catch(console.error)
