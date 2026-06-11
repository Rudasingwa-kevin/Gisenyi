const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

async function main() {
  const username = 'admin';
  const password = 'admin123';

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log('Admin user already exists');
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { username, password: hashed }
  });

  console.log(`Admin user created: ${username} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
