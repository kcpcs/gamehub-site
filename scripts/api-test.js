import http from 'http';

const BASE_URL = 'http://localhost:3000';

console.log('🧪 GameHub API集成测试套件');
console.log('=' .repeat(50));

async function fetchApi(path) {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + path;
    const start = Date.now();
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        try {
          const parsed = JSON.parse(data);
          resolve({ 
            status: res.statusCode, 
            data: parsed, 
            duration,
            url
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            data: null, 
            duration,
            raw: data,
            url
          });
        }
      });
    }).on('error', reject);
  });
}

async function testApi(name, path, expectedStatus = 200) {
  try {
    const result = await fetchApi(path);
    const pass = result.status === expectedStatus;
    const icon = pass ? '✅' : '❌';
    console.log(`${icon} ${name} - ${result.status} (${result.duration}ms)`);
    if (!pass) {
      console.log(`   URL: ${result.url}`);
    }
    return { name, path, ...result, pass };
  } catch (e) {
    console.log(`❌ ${name} - ERROR: ${e.message}`);
    return { name, path, pass: false, error: e.message };
  }
}

async function runTests() {
  console.log('\n📋 用户后台API测试');
  console.log('-'.repeat(30));

  const userTests = [
    testApi('健康检查', '/api/health'),
    testApi('游戏列表', '/api/games'),
    testApi('游戏列表(分页)', '/api/games?page=1&limit=12'),
    testApi('游戏列表(排序)', '/api/games?sort=popular'),
    testApi('攻略列表', '/api/guides'),
    testApi('Genshin兑换码', '/api/codes/genshin-impact'),
    testApi('Honkai兑换码', '/api/codes/honkai-star-rail'),
    testApi('Genshin Tier List', '/api/tierlist/genshin-impact'),
    testApi('Valorant Tier List', '/api/tierlist/valorant'),
    testApi('搜索(genshin)', '/api/search?q=genshin'),
  ];

  const userResults = await Promise.allSettled(userTests);

  console.log('\n📋 管理员后台API测试');
  console.log('-'.repeat(30));

  const adminTests = [
    testApi('仪表盘(默认)', '/api/admin/dashboard'),
    testApi('仪表盘(7天)', '/api/admin/dashboard?days=7'),
    testApi('仪表盘(90天)', '/api/admin/dashboard?days=90'),
    testApi('管理员游戏列表', '/api/admin/games'),
    testApi('管理员文章列表', '/api/admin/articles'),
    testApi('管理员兑换码', '/api/admin/codes'),
    testApi('管理员评论', '/api/admin/comments'),
    testApi('管理员用户', '/api/admin/admin-users'),
    testApi('审计日志', '/api/admin/audit-logs'),
    testApi('系统设置', '/api/admin/settings'),
  ];

  const adminResults = await Promise.allSettled(adminTests);

  console.log('\n' + '='.repeat(50));
  console.log('📊 测试统计');
  console.log('='.repeat(50));

  const allResults = [...userResults, ...adminResults];
  let passed = 0;
  let failed = 0;
  
  allResults.forEach(result => {
    if (result.status === 'fulfilled' && result.value?.pass) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📊 总计: ${allResults.length}`);
  console.log(`🎯 通过率: ${Math.round(passed / allResults.length * 100)}%`);

  console.log('\n📝 测试完成！');
  console.log('详细文档: API_INTEGRATION_TESTS.md');
}

runTests().catch(console.error);
