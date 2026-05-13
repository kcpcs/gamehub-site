import http from 'http';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function testApis() {
  console.log('🧪 Testing GameHub APIs...\n');

  const tests = [
    { name: 'Health Check', url: 'http://localhost:3000/api/health' },
    { name: 'Games List', url: 'http://localhost:3000/api/games' },
    { name: 'Codes (Genshin)', url: 'http://localhost:3000/api/codes/genshin-impact' },
    { name: 'Guides List', url: 'http://localhost:3000/api/guides' },
    { name: 'TierList (Valorant)', url: 'http://localhost:3000/api/tierlist/valorant' },
  ];

  for (const test of tests) {
    try {
      const result = await fetchJson(test.url);
      const status = result.status === 200 ? '✅' : '❌';
      console.log(`${status} ${test.name}: HTTP ${result.status}`);
      if (result.status === 200 && result.data.data) {
        if (Array.isArray(result.data.data.games)) {
          console.log(`   → 返回 ${result.data.data.games?.length || 0} 个游戏`);
        } else if (Array.isArray(result.data.data)) {
          console.log(`   → 返回 ${result.data.data.length || 0} 条数据`);
        } else if (result.data.data.game_name) {
          console.log(`   → 游戏: ${result.data.data.game_name}`);
        } else if (result.data.data.overview) {
          console.log(`   → 仪表盘正常`);
        }
      }
      console.log('');
    } catch (err) {
      console.log(`❌ ${test.name}: ${err.message}\n`);
    }
  }

  console.log('✅ API 测试完成！');
}

testApis();
