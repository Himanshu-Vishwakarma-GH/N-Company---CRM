"""
Invoice Service - Business logic for invoice management.
Handles invoice creation, retrieval, calculations, and Google Sheets integration.
"""

from typing import List, Optional, Tuple
from decimal import Decimal
from datetime import datetime, date
import logging
import uuid

from app.services.sheets_service import SheetsService
from app.schemas.invoice import (
    InvoiceCreate,
    InvoiceResponse,
    InvoiceItemResponse,
    InvoiceStatusUpdate
)

logger = logging.getLogger(__name__)


class InvoiceService:
    """Service for invoice business logic."""
    
    def __init__(self, sheets_service: SheetsService):
        """
        Initialize invoice service.
        
        Args:
            sheets_service: Google Sheets service instance
        """
        self.sheets = sheets_service
    
    def create_invoice(self, invoice_data: InvoiceCreate) -> InvoiceResponse:
        """
        Create a new invoice.
        
        Args:
            invoice_data: Invoice creation data
            
        Returns:
            Created invoice response
            
        Raises:
            ValueError: If client not found or validation fails
        """
        # Try to get client info, but allow manual client entry
        client = self.sheets.find_row("Clients", "client_id", invoice_data.client_id)
        
        # Use provided client name or fallback to database client name
        if invoice_data.client_name:
            client_name = invoice_data.client_name
        elif client:
            client_name = client.get("name", "")
        else:
            # If no client found and no name provided, create a placeholder
            client_name = f"Client {invoice_data.client_id}"
            logger.warning(f"Client {invoice_data.client_id} not found in database, using manual name")
        
        # Use custom invoice ID if provided, otherwise generate one
        if invoice_data.invoice_id:
            # Check if invoice ID already exists
            existing = self.sheets.find_row("Invoices", "invoice_id", invoice_data.invoice_id)
            if existing:
                raise ValueError(f"Invoice ID {invoice_data.invoice_id} already exists")
            invoice_id = invoice_data.invoice_id
        else:
            invoice_id = self._generate_invoice_id()
        
        # Calculate totals
        subtotal, total_tax, total_discount, grand_total = self._calculate_totals(
            invoice_data.items
        )
        
        # Create timestamp
        created_at = datetime.now()
        
        # Prepare invoice data for Invoices sheet
        invoice_row = {
            "invoice_id": invoice_id,
            "client_id": invoice_data.client_id,
            "client_name": client_name,
            "invoice_date": invoice_data.invoice_date.isoformat(),
            "due_date": invoice_data.due_date.isoformat(),
            "subtotal": str(subtotal),
            "total_tax": str(total_tax),
            "total_discount": str(total_discount),
            "grand_total": str(grand_total),
            "status": "draft",
            "sales_person": invoice_data.sales_person,
            "created_by": "System",  # Replace with actual user when auth is implemented
            "created_at": created_at.isoformat(),
            "updated_at": created_at.isoformat()
        }
        
        # Save to Invoices sheet
        success = self.sheets.append_row("Invoices", invoice_row)
        
        if not success:
            raise Exception("Failed to create invoice in Google Sheets")
        
        # Save invoice items
        item_responses = []
        for item_data in invoice_data.items:
            item_id = str(uuid.uuid4())[:8]
            
            # Calculate line total
            line_subtotal = Decimal(item_data.quantity) * item_data.unit_price
            line_tax = line_subtotal * (item_data.tax_percent / 100)
            line_discount = line_subtotal * (item_data.discount_percent / 100)
            line_total = line_subtotal + line_tax - line_discount
            
            item_row = {
                "item_id": item_id,
                "invoice_id": invoice_id,
                "service": item_data.service,
                "description": item_data.description,
                "quantity": str(item_data.quantity),
                "unit_price": str(item_data.unit_price),
                "tax_percent": str(item_data.tax_percent),
                "discount_percent": str(item_data.discount_percent),
                "line_total": str(line_total)
            }
            
            self.sheets.append_row("Invoice_Items", item_row)
            
            item_responses.append(InvoiceItemResponse(
                item_id=item_id,
                service=item_data.service,
                description=item_data.description,
                quantity=item_data.quantity,
                unit_price=item_data.unit_price,
                tax_percent=item_data.tax_percent,
                discount_percent=item_data.discount_percent,
                line_total=line_total
            ))
        
        logger.info(f"Created invoice {invoice_id} for client {invoice_data.client_id}")
        
        # Return response
        return InvoiceResponse(
            invoice_id=invoice_id,
            client_id=invoice_data.client_id,
            client_name=client_name,
            invoice_date=invoice_data.invoice_date,
            due_date=invoice_data.due_date,
            subtotal=subtotal,
            total_tax=total_tax,
            total_discount=total_discount,
            grand_total=grand_total,
            status="draft",
            sales_person=invoice_data.sales_person,
            items=item_responses,
            created_at=created_at
        )
    
    def get_invoice(self, invoice_id: str) -> Optional[InvoiceResponse]:
        """
        Get invoice by ID.
        
        Args:
            invoice_id: Invoice ID
            
        Returns:
            Invoice response or None if not found
        """
        # Get invoice from Invoices sheet
        invoice = self.sheets.find_row("Invoices", "invoice_id", invoice_id)
        
        if not invoice:
            return None
        
        # Get invoice items
        all_items = self.sheets.get_all_rows("Invoice_Items")
        invoice_items = [
            item for item in all_items 
            if item.get("invoice_id") == invoice_id
        ]
        
        # Build item responses
        item_responses = []
        for item in invoice_items:
            item_responses.append(InvoiceItemResponse(
                item_id=item.get("item_id", ""),
                service=item.get("service", ""),
                description=item.get("description", ""),
                quantity=int(item.get("quantity", 0)),
                unit_price=Decimal(item.get("unit_price", 0)),
                tax_percent=Decimal(item.get("tax_percent", 0)),
                discount_percent=Decimal(item.get("discount_percent", 0)),
                line_total=Decimal(item.get("line_total", 0))
            ))
        
        # Parse dates
        invoice_date = date.fromisoformat(invoice.get("invoice_date", ""))
        due_date = date.fromisoformat(invoice.get("due_date", ""))
        created_at = datetime.fromisoformat(invoice.get("created_at", ""))
        
        return InvoiceResponse(
            invoice_id=invoice.get("invoice_id", ""),
            client_id=invoice.get("client_id", ""),
            client_name=invoice.get("client_name", ""),
            invoice_date=invoice_date,
            due_date=due_date,
            subtotal=Decimal(invoice.get("subtotal", 0)),
            total_tax=Decimal(invoice.get("total_tax", 0)),
            total_discount=Decimal(invoice.get("total_discount", 0)),
            grand_total=Decimal(invoice.get("grand_total", 0)),
            status=invoice.get("status", "draft"),
            sales_person=invoice.get("sales_person", ""),
            items=item_responses,
            created_at=created_at
        )
    
    def list_invoices(
        self,
        status: Optional[str] = None,
        client_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[InvoiceResponse], int]:
        """
        List invoices with optional filtering.
        
        Args:
            status: Filter by status
            client_id: Filter by client
            limit: Max results to return
            offset: Number of results to skip
            
        Returns:
            Tuple of (list of invoices, total count)
        """
        # Get all invoices
        all_invoices = self.sheets.get_all_rows("Invoices")
        
        # Apply filters
        filtered_invoices = all_invoices
        
        if status:
            filtered_invoices = [
                inv for inv in filtered_invoices
                if inv.get("status") == status
            ]
        
        if client_id:
            filtered_invoices = [
                inv for inv in filtered_invoices
                if inv.get("client_id") == client_id
            ]
        
        total = len(filtered_invoices)
        
        # Apply pagination
        paginated_invoices = filtered_invoices[offset:offset + limit]
        
        # Build responses (without items for list view)
        responses = []
        for invoice in paginated_invoices:
            try:
                invoice_date = date.fromisoformat(invoice.get("invoice_date", ""))
                due_date = date.fromisoformat(invoice.get("due_date", ""))
                created_at = datetime.fromisoformat(invoice.get("created_at", ""))
                
                responses.append(InvoiceResponse(
                    invoice_id=invoice.get("invoice_id", ""),
                    client_id=invoice.get("client_id", ""),
                    client_name=invoice.get("client_name", ""),
                    invoice_date=invoice_date,
                    due_date=due_date,
                    subtotal=Decimal(invoice.get("subtotal", 0)),
                    total_tax=Decimal(invoice.get("total_tax", 0)),
                    total_discount=Decimal(invoice.get("total_discount", 0)),
                    grand_total=Decimal(invoice.get("grand_total", 0)),
                    status=invoice.get("status", "draft"),
                    sales_person=invoice.get("sales_person", ""),
                    items=[],  # Empty for list view
                    created_at=created_at
                ))
            except Exception as e:
                logger.error(f"Error parsing invoice: {e}")
                continue
        
        return responses, total
    
    def update_status(self, invoice_id: str, status_update: InvoiceStatusUpdate) -> bool:
        """
        Update invoice status.
        
        Args:
            invoice_id: Invoice ID
            status_update: Status update data
            
        Returns:
            True if successful
        """
        updated_at = datetime.now().isoformat()
        
        success = self.sheets.update_row(
            "Invoices",
            "invoice_id",
            invoice_id,
            {
                "status": status_update.status,
                "updated_at": updated_at
            }
        )
        
        if success:
            logger.info(f"Updated invoice {invoice_id} status to {status_update.status}")
        
        return success
    
    def _calculate_totals(
        self,
        items: List
    ) -> Tuple[Decimal, Decimal, Decimal, Decimal]:
        """
        Calculate invoice totals.
        
        Args:
            items: List of invoice items
            
        Returns:
            Tuple of (subtotal, total_tax, total_discount, grand_total)
        """
        subtotal = Decimal(0)
        total_tax = Decimal(0)
        total_discount = Decimal(0)
        
        for item in items:
            item_subtotal = Decimal(item.quantity) * item.unit_price
            subtotal += item_subtotal
            
            tax_amount = item_subtotal * (item.tax_percent / 100)
            total_tax += tax_amount
            
            discount_amount = item_subtotal * (item.discount_percent / 100)
            total_discount += discount_amount
        
        grand_total = subtotal + total_tax - total_discount
        
        return subtotal, total_tax, total_discount, grand_total
    
    def _generate_invoice_id(self) -> str:
        """
        Generate unique invoice ID in format INV-YYYY-XXX.
        
        Returns:
            Generated invoice ID
        """
        # Get all existing invoices
        invoices = self.sheets.get_all_rows("Invoices")
        
        # Get current year
        year = datetime.now().year
        
        # Find highest number for current year
        max_num = 0
        prefix = f"INV-{year}-"
        
        for invoice in invoices:
            inv_id = invoice.get("invoice_id", "")
            if inv_id.startswith(prefix):
                try:
                    num = int(inv_id.split("-")[-1])
                    max_num = max(max_num, num)
                except ValueError:
                    continue
        
        # Generate new ID
        new_num = max_num + 1
        return f"INV-{year}-{new_num:03d}"
