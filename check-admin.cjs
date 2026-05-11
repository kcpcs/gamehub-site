const {PrismaClient} = require('./node_modules/@prisma/client');
const p = new PrismaClient();
p.adminUser.findMany().then(a => {
  console.log('Found', a.length, 'admin users:');
  a.forEach(u => {
    console.log('Email:', u.email);
    console.log('Username:', u.username);
    console.log('Role:', u.role);
    console.log('---');
  });
}).catch(e => console.log('err:', e.message)).finally(() => p.$disconnect());
