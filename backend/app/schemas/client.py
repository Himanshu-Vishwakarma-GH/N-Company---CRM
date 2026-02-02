"""
Client schemas for request/response validation.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import date


class ClientBase(BaseModel):
    """Base client schema."""
    name: str = Field(..., min_length=1, max_length=200)
    contact: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    industry: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=500)


class ClientCreate(ClientBase):
    """Schema for creating a client."""
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Tech Innovations Pvt Ltd",
                "contact": "Priya Sharma",
                "email": "priya@techinnovations.com",
                "phone": "+91-98765-43210",
                "industry": "Technology",
                "address": "Mumbai, Maharashtra, India"
            }
        }


class Client(ClientBase):
    """Schema for client response."""
    client_id: str
    created_date: str
    total_invoices: int = 0
    total_revenue: float = 0.0
    
    class Config:
        from_attributes = True
