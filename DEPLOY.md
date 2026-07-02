# Deployment Guide: Railway → Vercel + Render

## Overview
- **Frontend (React)** → Vercel (free)
- **Backend (Express)** → Render free tier
- **Database** → Already on Supabase (no changes needed)
- **Domain** → gisenyi.top (update DNS at the end)

---

## Step 1: Deploy Backend to Render

1. Go to https://dashboard.render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Fill in:
   - **Name:** `gisenyi-api`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npx prisma migrate deploy && node src/server.js`
   - **Plan:** Free
5. Add these **Environment Variables** (copy from your Railway backend):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<your Supabase DATABASE_URL>
   DIRECT_URL=<your Supabase DIRECT_URL>
   CORS_ORIGIN=https://gisenyi.top,https://www.gisenyi.top,https://gisenyi.vercel.app
   JWT_SECRET=<your JWT_SECRET>
   SUPABASE_URL=<your SUPABASE_URL>
   SUPABASE_ANON_KEY=<your SUPABASE_ANON_KEY>
   SUPABASE_SERVICE_KEY=<your SUPABASE_SERVICE_KEY>
   SUPABASE_STORAGE_BUCKET=gisenyi
   CLOUDINARY_CLOUD_NAME=<your CLOUDINARY_CLOUD_NAME>
   CLOUDINARY_API_KEY=<your CLOUDINARY_API_KEY>
   CLOUDINARY_API_SECRET=<your CLOUDINARY_API_SECRET>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<your ADMIN_PASSWORD>
   ```
6. Click **Create Web Service**
7. Wait for deployment → your backend URL will be something like:
   `https://gisenyi-api.onrender.com`

**Important:** Copy this URL — you'll need it for the frontend.

---

## Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo
4. Fill in:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave empty/default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add this **Environment Variable**:
   ```
   VITE_API_URL = https://gisenyi-api.onrender.com
   ```
   (Use the actual Render URL from Step 1)
6. Click **Deploy**
7. Wait for deployment → your frontend URL will be something like:
   `https://gisenyi.vercel.app`

---

## Step 3: Update Render CORS

1. Go back to Render dashboard → your `gisenyi-api` service
2. Go to **Environment** tab
3. Update `CORS_ORIGIN` to include your Vercel URL:
   ```
   https://gisenyi.top,https://www.gisenyi.top,https://gisenyi.vercel.app
   ```
4. Save → Render will auto-redeploy

---

## Step 4: Connect Custom Domain

### On Vercel:
1. Go to your project → **Settings** → **Domains**
2. Add `gisenyi.top` and `www.gisenyi.top`
3. Vercel will show you DNS records to add

### On your domain registrar (where you bought gisenyi.top):
Update DNS records to point to Vercel:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### On Render (optional - for API subdomain):
If you want `api.gisenyi.top` instead of `gisenyi-api.onrender.com`:
1. Go to Render → Settings → Custom Domains
2. Add `api.gisenyi.top`
3. Add CNAME record: `api` → `gisenyi-api.onrender.com`

Then update `VITE_API_URL` on Vercel to `https://api.gisenyi.top` and redeploy.

---

## Step 5: Verify

1. Visit https://gisenyi.top — should show the site
2. Check that events/places load (API calls work)
3. Test admin login at https://gisenyi.top/admin
4. Check `/health` endpoint: https://gisenyi-api.onrender.com/health

---

## Important Notes

- **Render free tier** spins down after 15 min of inactivity — first request after sleep takes ~30s
- **Vercel free tier** has 100GB bandwidth/month — more than enough
- **Your Supabase database** is untouched — all data stays the same
- **Delete Railway** service only AFTER confirming Vercel+Render work correctly
