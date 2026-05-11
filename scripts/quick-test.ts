import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

async function runTest() {
  console.log('🚀 GameHub jiekou.ai 测试')
  console.log('=' .repeat(50))

  const JIEKOU_API_KEY = process.env.JIEKOU_API_KEY
  const JIEKOU_API_URL = process.env.JIEKOU_API_URL

  console.log(`URL: ${JIEKOU_API_URL}`)
  console.log(`API Key: ${JIEKOU_API_KEY ? '已配置' : '未配置'}`)

  if (!JIEKOU_API_KEY || !JIEKOU_API_URL) {
    console.error('❌ 配置不完整')
    return
  }

  try {
    console.log('\n🔍 测试API连接...')
    
    const response = await fetch(JIEKOU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JIEKOU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        messages: [{ role: 'user', content: '请回复"连接成功"四个字' }],
        max_tokens: 50
      })
    })

    console.log(`响应状态: ${response.status}`)
    
    const text = await response.text()
    console.log(`响应内容: ${text}`)

    const data = JSON.parse(text)
    
    if (data.choices?.[0]?.message?.content?.includes('连接成功')) {
      console.log('✅ API连接成功！')
      
      console.log('\n🧪 测试内容生成...')
      
      const articleResponse = await fetch(JIEKOU_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JIEKOU_API_KEY}`
        },
        body: JSON.stringify({
          model: 'claude-opus-4-7',
          messages: [{ role: 'user', content: '写一段100字左右的原神新手攻略' }],
          max_tokens: 200
        })
      })

      const articleData = await articleResponse.json() as { choices?: Array<{ message?: { content?: string } }> }
      const content = articleData.choices?.[0]?.message?.content
      
      console.log('✅ 内容生成成功！')
      console.log('生成的攻略:', content)
    } else {
      console.error('❌ API响应不符合预期')
    }

  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

runTest().catch(console.error)
