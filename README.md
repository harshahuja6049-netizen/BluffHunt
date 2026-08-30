# BluffHunt

Party word game: say your clue, hide your truth.

## Local development

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI`.
2. Install and run:

```bash
npm run install:all
npm run dev
```

In a second terminal:

```bash
npm run dev:frontend
```

- API + Socket.io: http://localhost:5000
- UI: http://localhost:5173

## Production (one service)

The backend serves the built React app from `frontend/dist`, so Socket.io and the UI share one origin.

```bash
npm run build
NODE_ENV=production npm start
```

Required host env vars:

| Name | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Set automatically by most hosts |
| `NODE_ENV` | `production` |
| `CLIENT_ORIGIN` | Optional. Comma-separated frontend origins if the UI is hosted separately |

Health check: `GET /api/health`

## Deploy

**Render / Railway / Fly:** connect this repo, use the Dockerfile or `render.yaml`. Set `MONGO_URI` in the dashboard.

**Docker:**

```bash
docker build -t bluffhunt .
docker run -p 5000:5000 -e MONGO_URI="your-uri" -e NODE_ENV=production bluffhunt
```
