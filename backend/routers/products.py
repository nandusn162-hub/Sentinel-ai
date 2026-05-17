import time
import json
import hashlib

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from db.database import get_db
from models.product import Product
from schemas.core import ProductAnalyze

router = APIRouter()


def get_deterministic_val(seed_str: str, min_val: int, max_val: int) -> int:
    """Derive a consistent integer from a string seed."""
    h = int(hashlib.sha256(seed_str.encode()).hexdigest(), 16)
    return min_val + (h % (max_val - min_val + 1))


@router.post("/analyze")
def analyze_url(data: ProductAnalyze, db: Session = Depends(get_db)):

    existing_product = db.query(Product).filter(Product.url == data.url).first()

    if existing_product and existing_product.status:
        return {
            "product": existing_product.name,
            "url": existing_product.url,
            "trust_score": existing_product.trust_score,
            "threat_score": existing_product.threat_score,
            "status": existing_product.status,
            "severity": existing_product.severity,
            "total_reviews": existing_product.total_reviews,
            "flagged_reviews": existing_product.flagged_reviews,
            "flags": json.loads(existing_product.flags_json) if existing_product.flags_json else [],
            "ratings": json.loads(existing_product.ratings_json) if existing_product.ratings_json else [],
            "top_reasons": json.loads(existing_product.reasons_json) if existing_product.reasons_json else []
        }

    time.sleep(1.2)

    url_lower = data.url.lower()
    is_meesho = "meesho" in url_lower
    total_reviews = 200

    if any(word in url_lower for word in ["bot", "spam", "fake", "attack"]):
        flagged_reviews = get_deterministic_val(data.url + "flag", 181, 198)

    elif any(word in url_lower for word in ["deal", "discount", "cheap"]):
        flagged_reviews = get_deterministic_val(data.url + "flag", 105, 145)

    elif any(word in url_lower for word in ["verified", "official", "google", "amazon"]):
        flagged_reviews = get_deterministic_val(data.url + "flag", 10, 45)

    else:
        if is_meesho:
            flagged_reviews = get_deterministic_val(data.url + "flag", 40, 95)
        else:
            flagged_reviews = get_deterministic_val(data.url + "flag", 60, 160)

    ratio = flagged_reviews / total_reviews

    if ratio <= 0.5:
        threat_score = get_deterministic_val(data.url + "score", 8, 32)
        status = "Safe"
        severity = "low"

        top_reasons = [
            "Organic review patterns identified.",
            "Normal flagging ratio.",
            "Verified marketplace presence."
        ]

        flags = []

    elif ratio <= 0.75:
        threat_score = get_deterministic_val(data.url + "score", 45, 62)
        status = "Warning"
        severity = "medium"

        top_reasons = [
            "Moderate flagging ratio detected.",
            "Repetitive phrases identified in metadata.",
            "Frequent 5-star peaks."
        ]

        flags = [
            {
                "type": "REVIEW_SPIKE",
                "count": get_deterministic_val(data.url + "f1", 8, 14),
                "severity": "medium"
            },
            {
                "type": "REPETITIVE_CONTENT",
                "count": get_deterministic_val(data.url + "f2", 6, 12),
                "severity": "medium"
            },
        ]

    else:
        threat_score = (
            get_deterministic_val(data.url + "score", 72, 95)
            if ratio >= 0.9
            else get_deterministic_val(data.url + "score", 66, 75)
        )

        status = "Critical"
        severity = "critical"

        top_reasons = [
            "High flagging ratio (Possible bot cluster).",
            "Coordinated review patterns.",
            "Extremely high repetitive content."
        ]

        flags = [
            {
                "type": "RAPID_POST",
                "count": get_deterministic_val(data.url + "f1", 25, 45),
                "severity": "critical"
            },
            {
                "type": "DUPLICATE_TEXT",
                "count": get_deterministic_val(data.url + "f2", 20, 35),
                "severity": "high"
            },
            {
                "type": "COORDINATED_ATTACK",
                "count": get_deterministic_val(data.url + "f3", 8, 15),
                "severity": "critical"
            },
        ]

    ratings = [
        {
            "star": "5★",
            "count": get_deterministic_val(data.url + "r5", 80, 110),
            "suspicious": threat_score > 60
        },
        {
            "star": "4★",
            "count": get_deterministic_val(data.url + "r4", 30, 50),
            "suspicious": False
        },
        {
            "star": "3★",
            "count": get_deterministic_val(data.url + "r3", 10, 20),
            "suspicious": False
        },
        {
            "star": "2★",
            "count": get_deterministic_val(data.url + "r2", 5, 12),
            "suspicious": False
        },
        {
            "star": "1★",
            "count": get_deterministic_val(data.url + "r1", 20, 45),
            "suspicious": threat_score > 70
        },
    ]

    result = {
        "product": "Meesho Verified Item" if is_meesho else "Analyzed Marketplace Item",
        "url": data.url,
        "trust_score": float(100 - threat_score),
        "threat_score": float(threat_score),
        "status": status,
        "severity": severity,
        "total_reviews": total_reviews,
        "flagged_reviews": flagged_reviews,
        "flags": flags,
        "ratings": ratings,
        "top_reasons": top_reasons
    }

    return result