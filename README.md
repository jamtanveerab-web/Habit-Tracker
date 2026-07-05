# Ledger — MERN Habit Tracker

Full MERN version of the Ledger habit tracker: daily bars, weekly toggle grid,
monthly progress-by-week table, a year-long heatmap, and an all-time overview
per habit with streaks. Data lives in MongoDB instead of localStorage, so it's
the same on every device.

## Structure

```
backend/    Express + Mongoose API
frontend/   React + Vite app
```

## Run locally

**Backend**
```
cd backend
cp .env.example .env      # set MONGO_URI if not using local Mongo
npm install
npm run seed               # optional: adds 4 sample habits with 14 days of history
npm run dev                 # http://localhost:5000
```

**Frontend**
```
cd frontend
cp .env.example .env       # set VITE_API_URL if backend isn't on localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

## Data model

Each habit stores `records` as a map of `"YYYY-MM-DD" -> true/false`, so there's
no fixed array size — it naturally covers a week, a month, or a full year
without any migration. `createdAt` (added automatically by Mongoose) doubles
as the habit's tracking start date, used to compute all-time completion %.

## API

| Method | Route                     | Body                    |
|--------|---------------------------|--------------------------|
| GET    | /api/habits                | —                        |
| POST   | /api/habits                | `{ name, goal }`         |
| PATCH  | /api/habits/:id/toggle      | `{ date: "YYYY-MM-DD" }` |
| PATCH  | /api/habits/:id             | `{ name?, goal? }`       |
| DELETE | /api/habits/:id             | —                        |

## Deploying (Vercel)

Deploy `frontend` and `backend` as two separate Vercel projects (same as your
other MERN apps):

1. Push this folder to GitHub.
2. Import the repo into Vercel twice — once with root directory `backend`,
   once with root directory `frontend`.
3. Backend project → add env var `MONGO_URI` (use MongoDB Atlas, not local
   Mongo, since Vercel functions can't reach `127.0.0.1`). Vercel runs
   Express as a serverless function automatically for Node projects.
4. Frontend project → add env var `VITE_API_URL` pointing to the deployed
   backend URL, e.g. `https://ledger-backend.vercel.app/api`.
5. Push to `main` — both redeploy automatically if linked to GitHub.
