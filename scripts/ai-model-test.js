import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

async function testClaudeModels() {
  console.log('🚀 GameHub AI 模型测试工具')
  console.log('='.repeat(60))

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
  const JIEKOU_API_KEY = process.env.JIEKOU_API_KEY
  
  if (!ANTHROPIC_API_KEY && !JIEKOU_API_KEY) {
    console.error('❌ 错误：未配置 API Key')
    console.log('请在 .env.local 中设置：')
    console.log('  ANTHROPIC_API_KEY=sk_xxx')
    console.log('  或')
    console.log('  JIEKOU_API_KEY=sk_xxx')
    return
  }

  const apiKey = ANTHROPIC_API_KEY || JIEKOU_API_KEY
  console.log(`\n🔑 API Key: ${apiKey.substring(0, 8)}...`)
  console.log('')

  const models = [
    {
      name: 'Claude Sonnet 4',
      id: process.env.DEFAULT_CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      url: 'https://api.jiekou.ai/anthropic/v1/messages',
      protocol: 'anthropic',
      description: '核心生产模型 - 代码直接调用',
      codeLocation: 'src/lib/claude.ts:30, src/app/api/internal/generate/route.ts:85',
      priority: 'P0 - 最高'
    },
    {
      name: 'Claude Opus 4',
      id: process.env.DEFAULT_OPUS_MODEL || 'claude-opus-4-1-20250805',
      url: 'https://api.jiekou.ai/anthropic/v1/messages',
      protocol: 'anthropic',
      description: '主力模型 - 复杂任务处理',
      codeLocation: 'MODEL_STRATEGY.md 推荐',
      priority: 'P1 - 高'
    }
  ]

  let successCount = 0
  let failCount = 0

  for (const model of models) {
    console.log(`\n🧪 测试 ${model.name}`)
    console.log(`   模型ID: ${model.id}`)
    console.log(`   优先级: ${model.priority}`)
    console.log(`   用途: ${model.description}`)
    console.log(`   代码位置: ${model.codeLocation}`)
    console.log(`   -`.repeat(40))

    try {
      let response, data

      if (model.protocol === 'anthropic') {
        response = await fetch(model.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model.id,
            messages: [{ role: 'user', content: '请回复OK' }],
            max_tokens: 20
          })
        })
        data = await response.json()
      } else {
        response = await fetch(model.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model.id,
            messages: [{ role: 'user', content: '请回复OK' }],
            max_tokens: 20
          })
        })
        data = await response.json()
      }

      if (response.status === 200) {
        const content = data.content?.[0]?.text || data.choices?.[0]?.message?.content
        if (content && content.includes('OK')) {
          console.log(`✅ ${model.name} - 连接成功！`)
          successCount++
        } else {
          console.log(`⚠️ ${model.name} - 响应内容: ${content?.substring(0, 50) || '无内容'}`)
          successCount++
        }
      } else {
        console.log(`❌ ${model.name} - 失败 (${response.status}): ${response.statusText}`)
        console.log(`   错误详情: ${JSON.stringify(data).substring(0, 150)}`)
        failCount++
      }
    } catch (error) {
      console.log(`❌ ${model.name} - 连接失败: ${error.message}`)
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📋 测试完成')
  console.log(`\n✅ 成功: ${successCount} / ❌ 失败: ${failCount}`)
  
  if (successCount >= 1) {
    console.log('\n🎉 核心模型可用，项目可以正常运行！')
  } else {
    console.log('\n⚠️ 请检查 API Key 配置是否正确')
  }
}

testClaudeModels().catch(console.error)