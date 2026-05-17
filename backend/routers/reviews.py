from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db

router = APIRouter()

@router.get("/{product_id}")
def get_reviews(product_id: int, db: Session = Depends(get_db)):
    return []

@router.get("/suspicious")
def get_suspicious_reviews(db: Session = Depends(get_db)):
    return []
