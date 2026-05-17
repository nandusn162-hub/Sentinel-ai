from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from models import *
from routers import auth, analytics, products, reviews

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sentinel AI API",
    description="Intelligent Suspicious Review & Fraud Detection System",
    version="2.4.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])

@app.get("/")
def read_root():
    return {"status": "operational", "system": "Sentinel AI Defense System"}
