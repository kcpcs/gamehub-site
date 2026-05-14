const http = require('http');

async function testGameAPI() {
  console.log('Testing /api/games/genshin-impact...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/games/genshin-impact',
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        resolve(data);
      });
    });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

testGameAPI().catch(console.error);