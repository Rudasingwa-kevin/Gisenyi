const app = require('./app');
const { exec } = require('child_process');
const { ensureBucket } = require('./utils/supabase');
const prisma = require('./utils/prisma');
const { promisify } = require('util');
const execAsync = promisify(exec);

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function start() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  try {
    console.log('Running database migrations...');
    await execAsync('npx prisma migrate deploy', { timeout: 60000 });
    console.log('Migrations complete');
  } catch (err) {
    console.error('Migration failed:', err.message);
  }

  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }

  try {
    await ensureBucket();
    console.log('Storage bucket ready');
  } catch (err) {
    console.warn('Storage bucket setup failed (non-fatal):', err.message);
  }
}

start();
