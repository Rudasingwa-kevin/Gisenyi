const app = require('./app');
const { ensureBucket } = require('./utils/supabase');
const prisma = require('./utils/prisma');
const { connectWithRetry } = require('./utils/prisma');

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function start() {
  try {
    await connectWithRetry();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  try {
    await ensureBucket();
    console.log('Storage bucket ready');
  } catch (err) {
    console.warn('Storage bucket setup failed (non-fatal):', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
