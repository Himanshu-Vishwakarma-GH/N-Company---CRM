from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class ActivityLogCreate(BaseModel):
    """Schema for creating a new activity log."""
    type: str = Field(..., description="Event type (e.g., client_created, invoice_generated)")
    title: str = Field(..., description="Short summary of the activity")
    description: str = Field(..., description="Detailed description")
    entity_id: Optional[str] = Field(None, description="Related entity ID")
    entity_type: Optional[str] = Field(None, description="Related entity type (client, invoice, ticket)")
    user: str = Field(default="Admin", description="User who performed the action")
    status: str = Field(default="unread", description="Read status (unread/read)")

class ActivityLog(BaseModel):
    """Complete activity log model."""
    log_id: str
    type: str
    title: str
    description: str
    entity_id: Optional[str] = None
    entity_type: Optional[str] = None
    user: str
    timestamp: str
    status: str

    class Config:
        from_attributes = True
