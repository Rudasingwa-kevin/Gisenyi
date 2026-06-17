const app = require('./app');
const { ensureBucket } = require('./utils/supabase');
const prisma = require('./utils/prisma');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await prisma.$connect();
    console.log('Database connected');
    await ensureBucket();
    console.log('Storage bucket ready');
  } catch (err) {
    console.error('Startup error:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
