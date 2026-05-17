# Sentinel AI

![Sentinel AI](https://img.shields.io/badge/Status-Operational-brightgreen)
![Version](https://img.shields.io/badge/Version-2.4.1-blue)

**Sentinel AI** is an advanced, full-stack cybersecurity intelligence platform designed to detect fraudulent review patterns on e-commerce marketplaces. It features a high-performance FastAPI backend coupled with an immersive, cinematic Next.js frontend to visualize threats in real-time.

---

## 🚀 Key Features

- **Deterministic Threat Scoring**: Uses a consistent, hash-based scoring engine (0-100) to ensure the same product URL always yields the exact same analysis result.
- **Heuristic Detection**: Analyzes review data for:
  - Text duplication and spam patterns.
  - Bot-like review frequency spikes.
  - Extreme rating manipulations (while respecting natural 4-star satisfaction).
- **Persistent Analysis**: Results are cached in a SQLite database to prevent redundant processing and ensure lightning-fast lookups.
- **Immersive Dashboard**: A sleek "cyber-aesthetic" interface featuring:
  - Real-time threat feeds.
  - Interactive radar and area charts for attack pattern visualization.
  - Multi-severity voice alerts and animated popups (Safe, Warning, Critical).

---

## 🛠️ Technology Stack

### Backend

- **Framework**: FastAPI (Python)
- **OR/M**: SQLAlchemy
- **Database**: SQLite (with foreign key enforcement)
- **Security**: Hash-based deterministic values for consistent scoring.

### Frontend

- **Framework**: Next.js 14+ (React 19)
- **Styling**: Vanilla CSS with a custom "glassmorphism" design system.
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 📥 Getting Started

For detailed environment setup, database seeding, and installation steps, please refer to the [SETUP.md](SETUP.md) file.

### Quick Commands

#### Backend Setup

```bash
cd backend
python -m venv venv
# Activate on Windows:
venv\Scripts\activate
# Activate on Unix:
source venv/bin/activate

pip install -r requirements.txt
python seed.py
python -m uvicorn main:app --reload --port 8000
```

_Backend runs at `http://localhost:8000`. API docs available at `/docs`._

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

_Frontend accessible at `http://localhost:3000`._

---

## 📁 Project Structure

```text
sentinel-ai/
├── backend/            # FastAPI Application
│   ├── db/             # Database config and migrations
│   ├── models/         # SQLAlchemy Models (Product, Review, etc.)
│   ├── routers/        # API Endpoints (Auth, Analytics, Products)
│   └── schemas/        # Pydantic Schemas
└── frontend/           # Next.js Application
    └── src/
        ├── app/        # Pages and layouts (Dashboard, Analyze, etc.)
        ├── components/ # UI Components (ThreatAlert, TrustGauge)
        └── lib/        # API client and state management
```

---

## 🛡️ License

Internal use only. Part of the Sentinel AI Security Initiative.
