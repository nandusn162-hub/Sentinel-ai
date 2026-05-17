from sqlalchemy.orm import Session
from .db.database import SessionLocal, engine, Base
from .models.product import Product
from .models.review import Review
from .models.flag import SuspiciousFlag
import random

def seed_db():
    print("Seeding database with demo data...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(Product).count() > 0:
        print("Database already seeded.")
        return

    # Create dummy products
    p1 = Product(name="ProMax Headphones Ultra", url="https://amazon.com/dp/B08XYZ", trust_score=31.0, threat_score=69.0)
    p2 = Product(name="SmartWatch X9", url="https://amazon.com/dp/B09ABC", trust_score=85.0, threat_score=15.0)
    
    db.add_all([p1, p2])
    db.commit()
    db.refresh(p1)
    db.refresh(p2)
    
    # Create some reviews
    for i in range(10):
        r = Review(product_id=p1.id, rating=1, title="Terrible", content="Do not buy, broke immediately.", is_suspicious=True)
        db.add(r)
    db.commit()
    
    print("Seeding complete.")

if __name__ == "__main__":
    seed_db()
