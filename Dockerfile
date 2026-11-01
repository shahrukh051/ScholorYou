# Multi-stage Dockerfile for ScholorYou (Full-Stack FastAPI + React)
# Stage 1: Build the React + ThreeUI Vite frontend
FROM node:20-slim AS frontend-build
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI backend
FROM python:3.11-slim
WORKDIR /app/backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=10000

# Install Python backend dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source
COPY backend/ .

# Copy built frontend assets so FastAPI static serving can find them
# Path: /app/frontend/dist (backend/app/main.py resolves ../../frontend/dist)
COPY --from=frontend-build /frontend/dist /app/frontend/dist

EXPOSE 10000

# WORKDIR is /app/backend, so `app.main` resolves correctly via relative imports
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
