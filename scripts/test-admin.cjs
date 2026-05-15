const http = require('http')

function fetchUrl(url, options = {}) {
  return new Promise((resolve) => {
    const parsed = new URL(url)
    const defaultOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname + (parsed.search || ''),
      method: 'GET',
      headers: {},
      timeout: 10000
    }
    
    const reqOptions = { ...defaultOptions, ...options, headers: { ...defaultOptions.headers, ...options.headers } }
    
    const req = http.request(reqOptions, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body: body
        })
      })
    })
    
    req.on('error', (e) => {
      resolve({
        status: -1,
        statusText: e.message,
        body: ''
      })
    })
    
    req.on('timeout', () => {
      req.destroy()
      resolve({
        status: -2,
        statusText: 'Timeout',
        body: ''
      })
    })
    
    if (options.body) {
      req.write(options.body)
    }
    req.end()
  })
}

async function testAdmin() {
  console.log('Testing Admin Login and AI Player Actions...\n')
  
  // 测试 admin 登录
  console.log('1. Testing admin login...')
  const loginResult = await fetchUrl('http://localhost:3000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gamehub.ai', password: 'admin123' })
  })
  
  console.log(`   Status: ${loginResult.status}`)
  console.log(`   Response: ${loginResult.body}`)
  
  let token = null
  if (loginResult.status === 200) {
    try {
      const data = JSON.parse(loginResult.body)
      token = data.token
      console.log(`   Token obtained: ${token ? 'Yes' : 'No'}`)
    } catch (e) {
      console.log('   Failed to parse response')
    }
  }
  
  // 测试获取 AI 玩家列表
  console.log('\n2. Testing GET /api/admin/ai-players...')
  const aiPlayersResult = await fetchUrl('http://localhost:3000/api/admin/ai-players', {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
  
  console.log(`   Status: ${aiPlayersResult.status}`)
  
  let playerId = null
  if (aiPlayersResult.status === 200) {
    try {
      const data = JSON.parse(aiPlayersResult.body)
      if (data.players && data.players.length > 0) {
        playerId = data.players[0].id
        console.log(`   Found ${data.players.length} AI players`)
        console.log(`   First player ID: ${playerId}`)
      }
    } catch (e) {
      console.log('   Failed to parse response')
    }
  }
  
  // 测试触发 AI 仿真人活动
  console.log('\n3. Testing POST /api/admin/ai-players/[id]/start...')
  let startResult = null
  if (playerId) {
    startResult = await fetchUrl(`http://localhost:3000/api/admin/ai-players/${playerId}/start`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    console.log(`   Status: ${startResult.status}`)
    console.log(`   Response: ${startResult.body}`)
  } else {
    console.log('   Skipped - no player ID available')
  }
  
  // 等待 30 秒检查 AIActivityLog
  console.log('\n4. Waiting 30 seconds for AI activity...')
  await new Promise(resolve => setTimeout(resolve, 30000))
  
  // 检查 AIActivityLog
  console.log('5. Checking AIActivityLog...')
  const activityLogResult = await fetchUrl('http://localhost:3000/api/admin/ai-activity-logs', {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
  
  console.log(`   Status: ${activityLogResult.status}`)
  if (activityLogResult.status === 200) {
    try {
      const data = JSON.parse(activityLogResult.body)
      console.log(`   Activity logs count: ${data.logs ? data.logs.length : 'N/A'}`)
    } catch (e) {
      console.log('   Failed to parse response')
    }
  }
  
  // 检查 AIContentReviewQueue
  console.log('\n6. Checking AIContentReviewQueue...')
  const reviewQueueResult = await fetchUrl('http://localhost:3000/api/admin/ai-review', {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
  
  console.log(`   Status: ${reviewQueueResult.status}`)
  if (reviewQueueResult.status === 200) {
    try {
      const data = JSON.parse(reviewQueueResult.body)
      console.log(`   Review queue count: ${data.reviews ? data.reviews.length : 'N/A'}`)
    } catch (e) {
      console.log('   Failed to parse response')
    }
  }
  
  console.log('\nAdmin tests completed!')
}

testAdmin()