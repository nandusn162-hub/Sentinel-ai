from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    url = Column(String, unique=True, index=True)
    image_url = Column(String)
    
    trust_score = Column(Float, default=100.0)
    threat_score = Column(Float, default=0.0)
    
    # Persistent Analysis Result Fields
    status = Column(String)
    severity = Column(String)
    total_reviews = Column(Integer, default=0)
    flagged_reviews = Column(Integer, default=0)
    flags_json = Column(String) # Serialized list of flags
    ratings_json = Column(String) # Serialized list of ratings
    reasons_json = Column(String) # Serialized list of reasons
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    reports = relationship("ThreatReport", back_populates="product", cascade="all, delete-orphan")
