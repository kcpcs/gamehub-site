require('dotenv').config({ path: '.env.local' })
const Anthropic = require('@anthropic-ai/sdk')

async function main() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.JIEKOU_API_KEY
  
  if (!ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY or JIEKOU_API_KEY is not set')
    console.log('Please set in .env.local:')
    console.log('  ANTHROPIC_API_KEY=sk_xxx')
    console.log('  or')
    console.log('  JIEKOU_API_KEY=sk_xxx')
    process.exit(1)
  }

  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
    baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.jiekou.ai/anthropic',
  })

  const systemPrompt = `You are a helpful assistant. Answer the user's questions concisely.`
  
  const userMessage = `What is the capital of France?`

  console.log('=== First API Call (no cache hit expected) ===')
  const response1 = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 100,
    system: {
      type: 'text',
      text: systemPrompt,
      cache_control: { type: 'ephemeral' },
    },
    messages: [{ role: 'user', content: userMessage }],
  })

  console.log(`Response 1: ${response1.content[0].text}`)
  console.log(`Input tokens: ${response1.usage.input_tokens}`)
  console.log(`Output tokens: ${response1.usage.output_tokens}`)
  console.log(`Cache read input tokens: ${response1.usage.cache_read_input_tokens || 0}`)
  console.log(`Cache write input tokens: ${response1.usage.cache_write_input_tokens || 0}`)

  console.log('\n=== Second API Call (cache hit expected) ===')
  const response2 = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 100,
    system: {
      type: 'text',
      text: systemPrompt,
      cache_control: { type: 'ephemeral' },
    },
    messages: [{ role: 'user', content: userMessage }],
  })

  console.log(`Response 2: ${response2.content[0].text}`)
  console.log(`Input tokens: ${response2.usage.input_tokens}`)
  console.log(`Output tokens: ${response2.usage.output_tokens}`)
  console.log(`Cache read input tokens: ${response2.usage.cache_read_input_tokens || 0}`)
  console.log(`Cache write input tokens: ${response2.usage.cache_write_input_tokens || 0}`)

  if (response2.usage.cache_read_input_tokens > 0) {
    console.log('\n✓ SUCCESS: Prompt caching is working correctly!')
    console.log(`  Cache read tokens: ${response2.usage.cache_read_input_tokens}`)
    process.exit(0)
  } else {
    console.error('\n✗ FAILURE: cache_read_input_tokens is not greater than 0')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})