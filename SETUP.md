# Sentinel AI - Setup & Deployment Instructions

## Architecture
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Three.js, ShadCN.
- **Backend**: FastAPI, SQLAlchemy, Python 3.10+.
- **Database**: PostgreSQL (or SQLite for local rapid development).

## Prerequisites
1. Node.js (v18+)
2. Python (v3.10+)
3. PostgreSQL (optional for local, required for production)

## Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt

# Seed the database with demo products and reviews
python seed.py

# Run the FastAPI server
python -m uvicorn main:app --reload --port 8000
```
> [!NOTE]
> The backend runs on `http://localhost:8000`. Swagger API docs are available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install

# Run the Next.js development server
npm run dev
```
> [!NOTE]
> The frontend runs on `http://localhost:3000`. Open this in your browser to experience the Sentinel AI Dashboard.

## Features Implemented
- **Cinematic Homepage**: Uses `CyberScene.tsx` (Three.js) for a premium 3D mesh background.
- **Auth System**: Animated `Login` and `Register` pages with JWT integration to the FastAPI backend.
- **Threat Dashboard**: `/(dashboard)/dashboard` features glowing trust gauges, an area chart for threat timelines, and live monitoring of suspicious users.
- **Scanner**: `/(dashboard)/analyze` allows uploading a Product URL or Image. It displays a "Detection Breakdown" and triggers a Web Speech API warning ("Threat level elevated").
- **Database Schema**: `backend/db/init.sql` contains the PostgreSQL schema demonstrating `VIEWS`, `FOREIGN KEYS`, and relationships.
