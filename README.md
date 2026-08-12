# To-Do List App (MERN)

Mobile-first task manager matching the Figma design.

## Stack

- **MongoDB Atlas** – cloud database  
- **Express** – REST API (`server/`, also exposed as Vercel serverless `api/`)  
- **React + Vite + Tailwind** – UI (`client/`)

## Local setup

1. Set Atlas URI in `server/.env` (see `server/.env.example`).
2. Install and run:

```bash
npm run install:all
npm run dev:server
npm run dev:client
```

- App: http://localhost:5173  
- API: http://localhost:5000/api/health  

## Deploy (recommended: Vercel for frontend + backend)

Netlify/Vercel are great for static frontends. A normal Express process does **not** stay running on them, so the API is deployed as a **serverless function** (`api/index.js`) on **Vercel**.

### Option A — Vercel (frontend + API together)

1. Push repo to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. Root directory: repo root (uses `vercel.json`).
4. Environment variables:

| Key | Value |
|-----|--------|
| `MONGODB_URI` | your Atlas connection string |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |

5. Deploy. App + `/api/*` are on the same domain.

### Option B — Netlify (frontend only) + Vercel (API)

1. **API:** deploy this same repo on Vercel (or only use the serverless `api/`), set `MONGODB_URI` + `CLIENT_URL=https://your-site.netlify.app`.
2. **Frontend:** Netlify → base `client`, build `npm run build`, publish `dist`.
3. In Netlify env:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://your-api.vercel.app/api` |

`render.yaml` was removed — not needed for Netlify/Vercel.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List (`search`, `date`, `weekStart`, `status`) |
| GET | `/api/tasks/:id` | Single task |
| POST | `/api/tasks` | Create |
| PUT | `/api/tasks/:id` | Update |
| PATCH | `/api/tasks/:id/status` | Status only |
| DELETE | `/api/tasks/:id` | Delete |
