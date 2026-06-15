# Gisenyi — Lake Kivu Travel Guide

A full-stack tourism destination guide for Gisenyi (Rubavu), Rwanda. Features a curated directory of places (hotels, restaurants, attractions, etc.), events calendar, photo gallery, interactive map, history timeline, and an admin dashboard.

## Tech Stack

| Layer | |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Framer Motion, Leaflet, React Router 7 |
| **Backend** | Express 5, Prisma ORM, PostgreSQL, JWT auth, Cloudinary image upload |
| **Tooling** | ESLint (flat config), cross-env |

## Prerequisites

- Node.js 18+
- PostgreSQL running on `localhost:5432`
- Cloudinary account (for image uploads)

## Setup

### 1. Clone and install dependencies

```bash
npm install
cd backend && npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL connection string and Cloudinary credentials.

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

### 5. Start development

Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
npm run dev
```

The app opens at `http://localhost:5173`. The API runs on `http://localhost:3000`.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | | `http://localhost:3000` | Backend API URL (frontend) |
| `PORT` | | `3000` | Backend port |
| `DATABASE_URL` | ✓ | | PostgreSQL connection string |
| `JWT_SECRET` | ✓ | | Secret for signing auth tokens |
| `CLOUDINARY_CLOUD_NAME` | ✓ | | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✓ | | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✓ | | Cloudinary API secret |

## Scripts

| Script | Directory | Description |
|---|---|---|
| `npm run dev` | root | Start Vite dev server |
| `npm run build` | root | Build frontend for production |
| `npm run lint` | root | Lint frontend code |
| `npm start` | backend | Start backend (production) |
| `npm run dev` | backend | Start backend (watch mode) |
| `npm run seed` | backend | Seed database from OpenStreetMap |

## Production Build

```bash
# Frontend
VITE_API_URL=https://your-api.com npm run build

# Backend
cd backend
NODE_ENV=production npm start
```

## Admin Access

Default admin credentials (change immediately):
- Username: `admin`
- Password: `admin123`

Create a new admin via `cd backend && node src/utils/seed-admin.js`.
