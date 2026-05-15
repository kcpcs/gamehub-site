const bcrypt = require('bcryptjs');

async function main() {
  const password = 'admin123';
  const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq';
  
  console.log('Testing bcrypt hash for password:', password);
  console.log('Hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Is valid:', isValid);
  
  // Generate a new hash to verify
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash:', newHash);
}

main();