"""
Pydantic schemas for Invoice module.
Handles request/response validation and serialization.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal


class InvoiceItemCreate(BaseModel):
    """Schema for creating an invoice item."""
    service: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., max_length=500)
    quantity: int = Field(..., gt=0)
    unit_price: Decimal = Field(..., ge=0)
    tax_percent: Decimal = Field(..., ge=0, le=100)
    discount_percent: Decimal = Field(default=0, ge=0, le=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "service": "Enterprise License",
                "description": "Annual subscription",
                "quantity": 10,
                "unit_price": 50000,
                "tax_percent": 18,
                "discount_percent": 10
            }
        }


class InvoiceItemResponse(BaseModel):
    """Schema for invoice item response."""
    item_id: str
    service: str
    description: str
    quantity: int
    unit_price: Decimal
    tax_percent: Decimal
    discount_percent: Decimal
    line_total: Decimal


class InvoiceCreate(BaseModel):
    """Schema for creating an invoice."""
    invoice_id: Optional[str] = Field(None, min_length=3, max_length=50)  # Optional custom ID
    client_id: str = Field(..., pattern=r"^CLT\d{3,}$")
    client_name: Optional[str] = None  # Optional client name (for new clients)
    invoice_date: date
    due_date: date
    sales_person: str = Field(..., min_length=1)
    items: List[InvoiceItemCreate] = Field(..., min_items=1)
    
    @validator('due_date')
    def due_date_must_be_after_invoice_date(cls, v, values):
        if 'invoice_date' in values and v < values['invoice_date']:
            raise ValueError('due_date must be after invoice_date')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "invoice_id": "INV-2026-CUSTOM-01",
                "client_id": "CLT001",
                "client_name": "Acme Corporation",
                "invoice_date": "2026-01-23",
                "due_date": "2026-02-23",
                "sales_person": "Rajesh Kumar",
                "items": [
                    {
                        "service": "Enterprise License",
                        "description": "Annual subscription",
                        "quantity": 10,
                        "unit_price": 50000,
                        "tax_percent": 18,
                        "discount_percent": 10
                    }
                ]
            }
        }


class InvoiceResponse(BaseModel):
    """Schema for invoice response."""
    invoice_id: str
    client_id: str
    client_name: str
    invoice_date: date
    due_date: date
    subtotal: Decimal
    total_tax: Decimal
    total_discount: Decimal
    grand_total: Decimal
    status: str
    sales_person: str
    items: List[InvoiceItemResponse]
    created_at: datetime
    
    class Config:
        json_encoders = {
            Decimal: lambda v: float(v),
            datetime: lambda v: v.isoformat()
        }


class InvoiceListResponse(BaseModel):
    """Schema for list of invoices."""
    invoices: List[InvoiceResponse]
    total: int
    limit: int
    offset: int


class InvoiceStatusUpdate(BaseModel):
    """Schema for updating invoice status."""
    status: str = Field(..., pattern="^(draft|pending|paid|overdue)$")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "paid"
            }
        }


class ApiResponse(BaseModel):
    """Standard API response wrapper."""
    success: bool
    message: str
    data: Optional[dict] = None
