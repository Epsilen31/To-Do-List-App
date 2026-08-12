# To-Do List App (MERN)

Mobile-first task manager matching the Figma design.

## Stack

- **MongoDB Atlas** – cloud database
- **Express** – REST API (`server/`, exposed on Vercel as serverless `api/`)
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

## Deploy on Vercel (frontend + API)

The Express API runs as a **serverless function** (`api/index.js`). The React app is the static frontend. Both ship from one Vercel project (`vercel.json`).

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com) (root of the repo).
3. Add environment variables:

| Key | Value |
|-----|--------|
| `MONGODB_URI` | your Atlas connection string |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |

4. Deploy.

After deploy:

- App: `https://your-app.vercel.app`
- Health: `https://your-app.vercel.app/api/health`

No `VITE_API_URL` needed — the client calls `/api` on the same domain.

In MongoDB Atlas → Network Access, allow `0.0.0.0/0` so Vercel can connect.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List (`search`, `date`, `weekStart`, `status`) |
| GET | `/api/tasks/:id` | Single task |
| POST | `/api/tasks` | Create |
| PUT | `/api/tasks/:id` | Update |
| PATCH | `/api/tasks/:id/status` | Status only |
| DELETE | `/api/tasks/:id` | Delete |
