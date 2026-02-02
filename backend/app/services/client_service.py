"""
Client service for business logic.
"""
from typing import List, Optional
from app.services.sheets_service import SheetsService
from app.schemas.client import Client, ClientCreate
from datetime import date


class ClientService:
    """Service for managing clients."""
    
    def __init__(self, sheets: SheetsService):
        self.sheets = sheets
    
    def _generate_client_id(self) -> str:
        """Generate a unique client ID."""
        # Get all existing clients
        clients = self.sheets.get_all_rows("Clients")
        
        if not clients or len(clients) == 0:  # Empty
            return "CLT001"
        
        # Extract existing IDs and find the highest number
        # Note: get_all_rows() returns list of dicts, not list of lists
        existing_ids = []
        for client in clients:  # clients is already a list of dicts
            if client and 'client_id' in client:
                client_id = client.get('client_id', '')
                if client_id and client_id.startswith("CLT"):
                    try:
                        num = int(client_id[3:])
                        existing_ids.append(num)
                    except ValueError:
                        continue
        
        # Generate next ID
        next_num = max(existing_ids) + 1 if existing_ids else 1
        return f"CLT{next_num:03d}"
    
    def create_client(self, client_data: ClientCreate) -> Client:
        """
        Create a new client and save to Google Sheets.
        
        Args:
            client_data: Client data from request
            
        Returns:
            Created client with generated ID
        """
        # Generate unique client ID
        client_id = self._generate_client_id()
        created_date = date.today().isoformat()
        
        # Prepare row for Google Sheets as dictionary (not list!)
        row = {
            "client_id": client_id,
            "name": client_data.name,
            "contact": client_data.contact or "",
            "email": client_data.email or "",
            "phone": client_data.phone or "",
            "industry": client_data.industry or "",
            "address": client_data.address or "",
            "created_date": created_date,
            "total_invoices": "0",
            "total_revenue": "0.0"
        }
        
        # Append to Clients sheet  
        self.sheets.append_row("Clients", row)
        
        # Return created client
        return Client(
            client_id=client_id,
            name=client_data.name,
            contact=client_data.contact,
            email=client_data.email,
            phone=client_data.phone,
            industry=client_data.industry,
            address=client_data.address,
            created_date=created_date,
            total_invoices=0,
            total_revenue=0.0
        )
    
    def list_clients(self, limit: Optional[int] = None) -> List[Client]:
        """
        List all clients from Google Sheets.
        
        Args:
            limit: Optional limit for number of clients to return
            
        Returns:
            List of clients
        """
        rows = self.sheets.get_all_rows("Clients")
        
        if not rows or len(rows) == 0:
            return []
        
        clients = []
        # get_all_rows returns list of dicts
        for row_dict in rows:
            if not row_dict or 'client_id' not in row_dict:
                continue
            
            client = Client(
                client_id=row_dict.get('client_id', ''),
                name=row_dict.get('name', ''),
                contact=row_dict.get('contact') or None,
                email=row_dict.get('email') or None,
                phone=row_dict.get('phone') or None,
                industry=row_dict.get('industry') or None,
                address=row_dict.get('address') or None,
                created_date=row_dict.get('created_date', date.today().isoformat()),
                total_invoices=self._safe_int(row_dict.get('total_invoices', 0)),
                total_revenue=self._safe_float(row_dict.get('total_revenue', 0.0))
            )
            clients.append(client)
            
            if limit and len(clients) >= limit:
                break
        
        return clients
    
    def get_client(self, client_id: str) -> Optional[Client]:
        """
        Get a specific client by ID.
        
        Args:
            client_id: Client ID
            
        Returns:
            Client if found, None otherwise
        """
        row_dict = self.sheets.find_row("Clients", "client_id", client_id)
        
        if not row_dict or 'client_id' not in row_dict:
            return None
        
        return Client(
            client_id=row_dict.get('client_id', ''),
            name=row_dict.get('name', ''),
            contact=row_dict.get('contact') or None,
            email=row_dict.get('email') or None,
            phone=row_dict.get('phone') or None,
            industry=row_dict.get('industry') or None,
            address=row_dict.get('address') or None,
            created_date=row_dict.get('created_date', date.today().isoformat()),
            total_invoices=self._safe_int(row_dict.get('total_invoices', 0)),
            total_revenue=self._safe_float(row_dict.get('total_revenue', 0.0))
        )
