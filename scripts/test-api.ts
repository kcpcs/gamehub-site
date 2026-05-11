import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

if (!CLAUDE_API_KEY) {
  console.error('❌ CLAUDE_API_KEY is not set in .env.local')
  console.log('\n📝 To fix this:')
  console.log('1. Copy .env.local.example to .env.local')
  console.log('2. Add your Claude API key to .env.local')
  console.log('3. Get your key from: https://console.anthropic.com/')
  process.exit(1)
}

if (CLAUDE_API_KEY.startsWith('sk-ant-')) {
  console.error('❌ CLAUDE_API_KEY appears to be invalid (starts with sk-ant-)')
  console.log('Please check your API key in .env.local')
  process.exit(1)
}

console.log('✅ CLAUDE_API_KEY is configured')

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
})

async function testApiConnection() {
  console.log('\n🔍 Testing Claude API connection...')

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Say "API connection successful!" and nothing else.',
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    if (responseText.includes('API connection successful')) {
      console.log('✅ Claude API connection successful!')
      console.log(`📊 Model: ${message.model}`)
      console.log(`💬 Response: ${responseText}`)
      return true
    } else {
      console.log('⚠️  API responded but message was unexpected')
      console.log(`💬 Response: ${responseText}`)
      return true
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Claude API connection failed:', error.message)

      if (error.message.includes('401')) {
        console.error('🔑 Invalid API key - please check your CLAUDE_API_KEY')
      } else if (error.message.includes('403')) {
        console.error('🔐 API key lacks required permissions')
      } else if (error.message.includes('429')) {
        console.error('⏱️  Rate limit exceeded - please wait and try again')
      } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        console.error('🌐 Network error - please check your internet connection')
      }
    }
    return false
  }
}

async function testContentGeneration() {
  console.log('\n🧪 Testing content generation...')

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Write a short gaming guide excerpt about "How to level up fast" in "Minecraft".
Return ONLY JSON in this exact format:
{"title": "string", "content": "string", "excerpt": "string", "seoKeywords": ["string"]}`,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0])
        console.log('✅ Content generation test successful!')
        console.log('📝 Generated content:')
        console.log(`   Title: ${content.title}`)
        console.log(`   Excerpt: ${content.excerpt}`)
        console.log(`   Keywords: ${content.seoKeywords.join(', ')}`)
        return true
      }
    } catch {
      console.log('⚠️  Response was not valid JSON')
      console.log(`💬 Response: ${responseText.substring(0, 200)}...`)
    }

    return true
  } catch (error) {
    console.error('❌ Content generation test failed:', error)
    return false
  }
}

async function runTests() {
  console.log('🚀 GameHub AI Configuration Test')
  console.log('=' .repeat(50))

  const connectionOk = await testApiConnection()

  if (!connectionOk) {
    console.log('\n❌ API connection failed - please fix the issues above')
    process.exit(1)
  }

  const contentOk = await testContentGeneration()

  if (!contentOk) {
    console.log('\n⚠️  Content generation test had issues')
  }

  console.log('\n' + '=' .repeat(50))
  console.log('✅ All tests completed!')
  console.log('\n📋 Next steps:')
  console.log('1. Run "node scripts/content-generator.ts" to generate content')
  console.log('2. Or configure n8n workflow from workflows/n8n-gamehub-workflow.json')
}

runTests().catch(console.error)
