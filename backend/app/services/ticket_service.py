"""
Service for managing Support Tickets in Google Sheets.
"""

from typing import List, Optional
from datetime import datetime
from app.services.sheets_service import SheetsService
from app.schemas.ticket import Ticket, TicketCreate, TicketUpdate
import logging

logger = logging.getLogger(__name__)


class TicketService:
    """Service for support ticket operations."""
    
    def __init__(self, sheets_service: SheetsService):
        """Initialize ticket service with sheets service."""
        self.sheets = sheets_service
        self.sheet_name = "Support_Tickets"
    
    def _generate_ticket_id(self) -> str:
        """Generate next sequential ticket ID."""
        try:
            rows = self.sheets.get_all_rows(self.sheet_name)
            
            if not rows:
                return "TKT001"
            
            # Extract numeric part from existing IDs
            max_num = 0
            for row in rows:
                ticket_id = row.get('ticket_id', '')
                if ticket_id.startswith('TKT'):
                    try:
                        num = int(ticket_id[3:])
                        max_num = max(max_num, num)
                    except ValueError:
                        continue
            
            # Generate next ID
            next_num = max_num + 1
            return f"TKT{next_num:03d}"
            
        except Exception as e:
            logger.error(f"Error generating ticket ID: {e}")
            # Fallback to timestamp-based ID
            return f"TKT{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    def create_ticket(self, ticket_data: TicketCreate) -> Ticket:
        """
        Create a new support ticket.
        
        Args:
            ticket_data: Ticket creation data
            
        Returns:
            Created ticket
        """
        ticket_id = self._generate_ticket_id()
        created_date = datetime.now().date().isoformat()
        
        # Prepare ticket row for Google Sheets
        ticket_row = {
            "ticket_id": ticket_id,
            "title": ticket_data.title,
            "description": ticket_data.description,
            "client_id": ticket_data.client_id,
            "client_name": ticket_data.client_name,
            "status": "open",  # All new tickets start as open
            "priority": ticket_data.priority,
            "assigned_to": ticket_data.assigned_to or "",
            "category": ticket_data.category,
            "created_date": created_date,
            "updated_date": created_date,
            "resolved_date": ""
        }
        
        # Save to Google Sheets
        success = self.sheets.append_row(self.sheet_name, ticket_row)
        
        if not success:
            raise Exception("Failed to create ticket in Google Sheets")
        
        logger.info(f"Created ticket {ticket_id}")
        
        return Ticket(**ticket_row)
    
    def list_tickets(
        self,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        client_id: Optional[str] = None,
        limit: Optional[int] = None
    ) -> List[Ticket]:
        """
        List all tickets with optional filters.
        
        Args:
            status: Filter by status
            priority: Filter by priority  
            client_id: Filter by client ID
            limit: Maximum number of tickets to return
            
        Returns:
            List of tickets
        """
        rows = self.sheets.get_all_rows(self.sheet_name)
        
        if not rows:
            return []
        
        tickets = []
        for row_dict in rows:
            if not row_dict or 'ticket_id' not in row_dict:
                continue
            
            # Apply filters
            if status and row_dict.get('status') != status:
                continue
            if priority and row_dict.get('priority') != priority:
                continue
            if client_id and row_dict.get('client_id') != client_id:
                continue
            
            try:
                ticket = Ticket(**row_dict)
                tickets.append(ticket)
            except Exception as e:
                logger.warning(f"Error parsing ticket row: {e}")
                continue
        
        # Apply limit
        if limit and limit > 0:
            tickets = tickets[:limit]
        
        logger.info(f"Retrieved {len(tickets)} tickets")
        return tickets
    
    def get_ticket(self, ticket_id: str) -> Optional[Ticket]:
        """
        Get a single ticket by ID.
        
        Args:
            ticket_id: Ticket ID
            
        Returns:
            Ticket if found, None otherwise
        """
        ticket_row = self.sheets.find_row(self.sheet_name, "ticket_id", ticket_id)
        
        if not ticket_row:
            return None
        
        return Ticket(**ticket_row)
    
    def update_ticket(self, ticket_id: str, updates: TicketUpdate) -> Ticket:
        """
        Update ticket details.
        
        Args:
            ticket_id: Ticket ID
            updates: Fields to update
            
        Returns:
            Updated ticket
        """
        # Build update dictionary (only include provided fields)
        update_data = {}
        if updates.title is not None:
            update_data["title"] = updates.title
        if updates.description is not None:
            update_data["description"] = updates.description
        if updates.priority is not None:
            update_data["priority"] = updates.priority
        if updates.category is not None:
            update_data["category"] = updates.category
        if updates.assigned_to is not None:
            update_data["assigned_to"] = updates.assigned_to
        if updates.status is not None:
            update_data["status"] = updates.status
            # If status changed to resolved, set resolved date
            if updates.status == "resolved":
                update_data["resolved_date"] = datetime.now().date().isoformat()
        
        # Always update the updated_date
        update_data["updated_date"] = datetime.now().date().isoformat()
        
        # Update in Google Sheets
        success = self.sheets.update_row(
            sheet_name=self.sheet_name,
            key="ticket_id",
            value=ticket_id,
            data=update_data
        )
        
        if not success:
            raise Exception(f"Failed to update ticket {ticket_id}")
        
        logger.info(f"Updated ticket {ticket_id}")
        
        # Return updated ticket
        return self.get_ticket(ticket_id)
    
    def update_status(self, ticket_id: str, status: str) -> Ticket:
        """
        Update ticket status only.
        
        Args:
            ticket_id: Ticket ID
            status: New status
            
        Returns:
            Updated ticket
        """
        update_data = {
            "status": status,
            "updated_date": datetime.now().date().isoformat()
        }
        
        # If status is resolved, set resolved_date
        if status == "resolved":
            update_data["resolved_date"] = datetime.now().date().isoformat()
        
        success = self.sheets.update_row(
            sheet_name=self.sheet_name,
            key="ticket_id",
            value=ticket_id,
            data=update_data
        )
        
        if not success:
            raise Exception(f"Failed to update ticket {ticket_id} status")
        
        logger.info(f"Updated ticket {ticket_id} status to {status}")
        
        return self.get_ticket(ticket_id)
