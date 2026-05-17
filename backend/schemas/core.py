from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ProductAnalyze(BaseModel):
    url: str

class ReviewCreate(BaseModel):
    rating: int
    title: Optional[str] = None
    content: Optional[str] = None
    product_id: int
