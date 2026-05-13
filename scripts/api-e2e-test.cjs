#!/usr/bin/env node
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const BASE_URL = 'http://localhost:3000'
const results = []

async function testEndpoint(name, endpoint, options = {}) {
  const start = Date.now()
  try {
    const url = `${BASE_URL}${endpoint}`
    console.log(`\n🔍 Testing: ${name}`)
    console.log(`   URL: ${url}`)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const time = Date.now() - start
    
    if (response.ok) {
      let data
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }
      console.log(`   ✅ PASSED (${time}ms)`)
      console.log(`   Status: ${response.status}`)
      results.push({ name, status: 'pass', time, data })
      return { name, status: 'pass', time, data }
    } else {
      console.log(`   ❌ FAILED (${time}ms)`)
      console.log(`   Status: ${response.status}`)
      const errorText = await response.text().catch(() => 'No error text')
      results.push({ name, status: 'fail', time, error: `Status ${response.status}: ${errorText}` })
      return { name, status: 'fail', time, error: `Status ${response.status}` }
    }
  } catch (error) {
    const time = Date.now() - start
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.log(`   ❌ FAILED (${time}ms)`)
    console.log(`   Error: ${errorMsg}`)
    results.push({ name, status: 'fail', time, error: errorMsg })
    return { name, status: 'fail', time, error: errorMsg }
  }
}

async function runTests() {
  console.log('🚀 GameHub API End-to-End Test Suite')
  console.log('=' .repeat(70))
  console.log(`📡 Base URL: ${BASE_URL}`)
  console.log('⏰ Starting tests...\n')

  // Check if server is reachable first
  console.log('📡 Checking server connection...')
  try {
    await fetch(BASE_URL, { method: 'HEAD' })
    console.log('✅ Server is reachable!\n')
  } catch {
    console.error('❌ Server is NOT reachable!')
    console.error('Please make sure the dev server is running at http://localhost:3000')
    process.exit(1)
  }

  // Health Check
  await testEndpoint('Health Check', '/api/health')

  // Games API
  await testEndpoint('Games List', '/api/games')
  await testEndpoint('Game Details (Genshin Impact)', '/api/games/genshin-impact')

  // Guides API
  await testEndpoint('Guides List', '/api/guides')

  // Codes API
  await testEndpoint('Codes for Genshin Impact', '/api/codes/genshin-impact')

  // Tier List API
  await testEndpoint('Tier List for Genshin Impact', '/api/tierlist/genshin-impact')

  // Search API
  await testEndpoint('Search (genshin)', '/api/search?q=genshin')
  await testEndpoint('Search (minecraft)', '/api/search?q=minecraft')

  // Summary
  console.log('\n' + '=' .repeat(70))
  console.log('📊 TEST SUMMARY')
  console.log('=' .repeat(70))
  
  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const total = results.length
  
  console.log(`\n📈 Total: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  
  if (failed > 0) {
    console.log('\n❌ Failed tests:')
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`)
    })
  }
  
  const avgTime = Math.round(results.filter(r => r.time).reduce((sum, r) => sum + (r.time || 0), 0) / passed)
  console.log(`\n⏱️  Average response time: ${avgTime}ms`)
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!')
  } else {
    console.log(`\n⚠️  ${failed} tests failed`)
  }
  
  console.log('\n' + '=' .repeat(70))

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: { total, passed, failed },
    results,
  }

  return report
}

runTests().catch(console.error)
