import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

async function debugApi() {
  const JIEKOU_API_KEY = process.env.JIEKOU_API_KEY
  const JIEKOU_API_URL = process.env.JIEKOU_API_URL || 'https://api.jiekou.ai/v1/chat/completions'

  console.log('🚀 API调试模式')
  console.log('=' .repeat(50))
  console.log(`URL: ${JIEKOU_API_URL}`)
  console.log(`API Key: ${JIEKOU_API_KEY ? '已配置' : '未配置'}`)
  console.log('=' .repeat(50))

  if (!JIEKOU_API_KEY) {
    console.error('❌ API密钥未配置')
    return
  }

  try {
    const response = await fetch(JIEKOU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JIEKOU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'google-gemma-3-12b-it',
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ],
        max_tokens: 100
      })
    })

    console.log(`\n📡 响应状态: ${response.status} ${response.statusText}`)
    console.log(`📋 响应头:`)
    for (const [key, value] of response.headers) {
      console.log(`  ${key}: ${value}`)
    }

    console.log(`\n📝 原始响应内容:`)
    const text = await response.text()
    console.log(text)

    try {
      const json = JSON.parse(text)
      console.log(`\n✅ 解析成功，格式正确`)
      console.log(JSON.stringify(json, null, 2))
    } catch (parseError) {
      console.log(`\n❌ JSON解析失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }

  } catch (error) {
    console.error(`\n❌ 请求失败: ${error}`)
  }
}

debugApi().catch(console.error)
