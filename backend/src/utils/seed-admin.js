const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`Admin user '${username}' already exists`);
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
