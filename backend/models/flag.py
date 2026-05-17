from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from db.database import Base

class SuspiciousFlag(Base):
    __tablename__ = "suspicious_flags"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    flag_type = Column(String, index=True, nullable=False) # RAPID_POST, DUPLICATE_TEXT, EXTREME_RATING, COORDINATED_ATTACK
    severity = Column(String, default="low") # critical, high, medium, low
    confidence_score = Column(Float, default=0.0)
    reason = Column(String)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    review = relationship("Review", back_populates="flags")
    user = relationship("User", back_populates="flags_triggered")
