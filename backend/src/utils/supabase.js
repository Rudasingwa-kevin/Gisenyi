const { createClient } = require('@supabase/supabase-js');

let client = null;

function getClient() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
    }
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}

const supabase = new Proxy({}, {
  get(_, prop) {
    return getClient()[prop];
  }
});

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'gisenyi';

async function ensureBucket() {
  try {
    const sb = getClient();
    const { data: buckets } = await sb.storage.listBuckets();
    if (buckets?.some(b => b.name === BUCKET_NAME)) return;

    const { error } = await sb.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/quicktime', 'video/webm'],
      fileSizeLimit: 10 * 1024 * 1024,
    });

    if (error) console.error('Failed to create storage bucket:', error.message);
  } catch (err) {
    console.error('Storage setup error:', err.message);
  }
}

module.exports = { supabase, ensureBucket };
