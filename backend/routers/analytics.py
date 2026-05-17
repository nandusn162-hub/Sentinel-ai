from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db.database import get_db
from ..models.review import Review
from ..models.flag import SuspiciousFlag
from ..models.product import Product
from ..models.user import User

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    total_reviews = db.query(func.count(Review.id)).scalar() or 0
    flagged_reviews = db.query(func.count(Review.id)).filter(Review.is_suspicious == True).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    
    # If empty database, return mock data to show UI
    if total_reviews == 0:
        return {
            "total": 2847,
            "flagged": 143,
            "products": 87,
            "users": 1204
        }
    
    return {
        "total": total_reviews,
        "flagged": flagged_reviews,
        "products": total_products,
        "users": total_users
    }

@router.get("/fraud-timeline")
def get_fraud_timeline():
    # Stub for future implementation
    return []

@router.get("/threat-map")
def get_threat_map():
    # Stub for future implementation
    return []
