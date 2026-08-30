FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/

RUN npm ci --omit=dev --prefix backend && npm ci --prefix frontend

COPY backend ./backend
COPY frontend ./frontend

RUN npm run build --prefix frontend

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "backend/server.js"]
