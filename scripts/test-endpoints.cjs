const http = require('http')

const endpoints = [
  { method: 'GET', url: 'http://localhost:3000/' },
  { method: 'GET', url: 'http://localhost:3000/games' },
  { method: 'GET', url: 'http://localhost:3000/codes' },
  { method: 'GET', url: 'http://localhost:3000/guides' },
  { method: 'GET', url: 'http://localhost:3000/tier-list' },
  { method: 'GET', url: 'http://localhost:3000/calendar' },
  { method: 'GET', url: 'http://localhost:3000/compare' },
  { method: 'GET', url: 'http://localhost:3000/search?q=genshin' },
  { method: 'GET', url: 'http://localhost:3000/api/games' },
  { method: 'GET', url: 'http://localhost:3000/api/codes' },
  { method: 'GET', url: 'http://localhost:3000/api/rss' },
  { method: 'GET', url: 'http://localhost:3000/api/search/suggest?q=elden' },
]

function fetchUrl(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url)
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname + (parsed.search || ''),
      method: 'GET',
      timeout: 10000
    }
    
    const req = http.request(options, (res) => {
      resolve({
        status: res.statusCode,
        statusText: res.statusMessage
      })
    })
    
    req.on('error', (e) => {
      resolve({
        status: -1,
        statusText: e.message
      })
    })
    
    req.on('timeout', () => {
      req.destroy()
      resolve({
        status: -2,
        statusText: 'Timeout'
      })
    })
    
    req.end()
  })
}

async function testEndpoints() {
  console.log('Testing core endpoints...\n')
  
  const results = []
  
  for (const endpoint of endpoints) {
    const result = await fetchUrl(endpoint.url)
    results.push({
      method: endpoint.method,
      url: endpoint.url,
      status: result.status,
      statusText: result.statusText,
      success: result.status >= 200 && result.status < 500
    })
  }
  
  console.log('Endpoint Test Results:')
  console.log('='.repeat(80))
  console.log(`| Method | URL | Status | Status Text | Success |`)
  console.log(`|--------|-----|--------|-------------|---------|`)
  
  for (const result of results) {
    const statusColor = result.success ? '\x1b[32m' : '\x1b[31m'
    const resetColor = '\x1b[0m'
    console.log(`| ${result.method} | ${result.url} | ${statusColor}${result.status}${resetColor} | ${result.statusText} | ${result.success ? 'Yes' : 'No'} |`)
  }
  
  console.log('\n' + '='.repeat(80))
  
  const successCount = results.filter(r => r.success).length
  const totalCount = results.length
  console.log(`\nSummary: ${successCount}/${totalCount} endpoints passed`)
  
  return results
}

testEndpoints()