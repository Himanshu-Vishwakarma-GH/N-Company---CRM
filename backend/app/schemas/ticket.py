"""
Pydantic schemas for Support Tickets.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class TicketCreate(BaseModel):
    """Schema for creating a new ticket."""
    title: str = Field(..., min_length=1, max_length=200, description="Ticket title/subject")
    description: str = Field(..., min_length=1, description="Detailed description of the issue")
    client_id: str = Field(..., description="Client ID who reported the ticket")
    client_name: str = Field(..., description="Client name for display")
    priority: str = Field(default="medium", description="Priority: low, medium, high, critical")
    category: str = Field(default="general", description="Category: technical, billing, general, feature_request")
    assigned_to: Optional[str] = Field(default=None, description="Support agent assigned to ticket")


class TicketUpdate(BaseModel):
    """Schema for updating a ticket."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assigned_to: Optional[str] = None
    status: Optional[str] = None


class Ticket(BaseModel):
    """Complete ticket model."""
    ticket_id: str
    title: str
    description: str
    client_id: str
    client_name: str
    status: str  # open, in_progress, resolved, closed
    priority: str  # low, medium, high, critical
    assigned_to: Optional[str] = None
    category: str
    created_date: str
    updated_date: str
    resolved_date: Optional[str] = None

    class Config:
        from_attributes = True
