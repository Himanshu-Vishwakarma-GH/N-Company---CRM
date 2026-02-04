"""
API Router for Support Tickets.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.schemas.ticket import Ticket, TicketCreate, TicketUpdate
from app.services.ticket_service import TicketService
from app.services.sheets_service import SheetsService
from app.services.activity_service import ActivityService
from app.schemas.activity import ActivityLogCreate
from app.core.config import settings
from app.core.dependencies import verify_api_key
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/tickets",
    tags=["tickets"],
    dependencies=[Depends(verify_api_key)]
)

# Initialize services
sheets_service = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)
ticket_service = TicketService(sheets_service)
activity_service = ActivityService(sheets_service)


@router.post("", response_model=dict, status_code=201)
async def create_ticket(ticket_data: TicketCreate):
    """
    Create a new support ticket.
    
    Returns created ticket with auto-generated ID.
    """
    try:
        logger.info(f"Creating ticket: {ticket_data.title}")
        ticket = ticket_service.create_ticket(ticket_data)
        
        # Log activity
        activity_service.log_activity(ActivityLogCreate(
            type="ticket_created",
            title="New Support Ticket",
            description=f"Ticket {ticket.ticket_id}: {ticket.title}",
            entity_id=ticket.ticket_id,
            entity_type="ticket",
            user=ticket.assigned_to or "System"
        ))
        
        return {
            "success": True,
            "message": f"Ticket {ticket.ticket_id} created successfully",
            "data": ticket.dict()
        }
    except Exception as e:
        logger.error(f"Error creating ticket: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=dict)
async def list_tickets(
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    client_id: Optional[str] = Query(None, description="Filter by client ID"),
    limit: Optional[int] = Query(50, ge=1, le=500, description="Max tickets to return")
):
    """
    List all tickets with optional filters.
    
    Query params:
    - status: Filter by status (open, in_progress, resolved, closed)
    - priority: Filter by priority (low, medium, high, critical)
    - client_id: Filter by client ID
    - limit: Maximum number of tickets (default 50)
    """
    try:
        logger.info(f"Fetching tickets with filters: status={status}, priority={priority}, client_id={client_id}")
        tickets = ticket_service.list_tickets(
            status=status,
            priority=priority,
            client_id=client_id,
            limit=limit
        )
        
        return {
            "success": True,
            "message": f"Retrieved {len(tickets)} tickets",
            "data": {
                "tickets": [ticket.dict() for ticket in tickets],
                "total": len(tickets),
                "limit": limit
            }
        }
    except Exception as e:
        logger.error(f"Error fetching tickets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{ticket_id}", response_model=dict)
async def get_ticket(ticket_id: str):
    """
    Get a single ticket by ID.
    """
    try:
        logger.info(f"Fetching ticket: {ticket_id}")
        ticket = ticket_service.get_ticket(ticket_id)
        
        if not ticket:
            raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
        
        return {
            "success": True,
            "data": ticket.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching ticket {ticket_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{ticket_id}", response_model=dict)
async def update_ticket(ticket_id: str, updates: TicketUpdate):
    """
    Update ticket details.
    
    All fields are optional - only provided fields will be updated.
    """
    try:
        logger.info(f"Updating ticket: {ticket_id}")
        
        # Check if ticket exists
        existing = ticket_service.get_ticket(ticket_id)
        if not existing:
            raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
        
        updated_ticket = ticket_service.update_ticket(ticket_id, updates)
        
        return {
            "success": True,
            "message": f"Ticket {ticket_id} updated successfully",
            "data": updated_ticket.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating ticket {ticket_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{ticket_id}/status", response_model=dict)
async def update_ticket_status(ticket_id: str, status: str = Query(..., description="New status")):
    """
    Update only the ticket status.
    
    Status values: open, in_progress, resolved, closed
    
    If status is changed to 'resolved', resolved_date is automatically set.
    """
    try:
        logger.info(f"Updating ticket {ticket_id} status to {status}")
        
        # Validate status
        valid_statuses = ["open", "in_progress", "resolved", "closed"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Check if ticket exists
        existing = ticket_service.get_ticket(ticket_id)
        if not existing:
            raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
        
        updated_ticket = ticket_service.update_status(ticket_id, status)
        
        return {
            "success": True,
            "message": f"Ticket {ticket_id} status updated to {status}",
            "data": updated_ticket.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating ticket {ticket_id} status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
