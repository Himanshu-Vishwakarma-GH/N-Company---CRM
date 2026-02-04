"""
Invoice API Router.
Handles all invoice-related endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional

from app.core.config import settings
from app.core.dependencies import verify_api_key
from app.services.sheets_service import SheetsService
from app.services.invoice_service import InvoiceService
from app.services.activity_service import ActivityService
from app.schemas.activity import ActivityLogCreate
from app.schemas.invoice import (
    InvoiceCreate,
    InvoiceResponse,
    InvoiceListResponse,
    InvoiceStatusUpdate,
    ApiResponse
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/invoices",
    tags=["invoices"]
)

# Initialize services
sheets_service = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)
invoice_service = InvoiceService(sheets_service)
activity_service = ActivityService(sheets_service)


@router.post(
    "",
    response_model=ApiResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new invoice",
    description="Create a new invoice with line items and save to Google Sheets"
)
async def create_invoice(
    invoice_data: InvoiceCreate,
    api_key: str = Depends(verify_api_key)
):
    """
    Create a new invoice.
    
    - **client_id**: Client ID (format: CLTXXX)
    - **invoice_date**: Invoice creation date
    - **due_date**: Payment due date
    - **sales_person**: Name of salesperson
    - **items**: List of invoice line items
    
    Returns created invoice with generated ID and calculated totals.
    """
    try:
        invoice = invoice_service.create_invoice(invoice_data)
        
        # Log activity
        activity_service.log_activity(ActivityLogCreate(
            type="invoice_generated",
            title="Invoice Generated",
            description=f"Generated invoice #{invoice.invoice_id} for {invoice.client_id}",
            entity_id=invoice.invoice_id,
            entity_type="invoice",
            user=invoice_data.sales_person or "Admin"
        ))
        
        return ApiResponse(
            success=True,
            message="Invoice created successfully",
            data=invoice.dict()
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating invoice: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create invoice"
        )


@router.get(
    "/{invoice_id}",
    response_model=ApiResponse,
    summary="Get invoice by ID",
    description="Retrieve invoice details including all line items"
)
async def get_invoice(
    invoice_id: str,
    api_key: str = Depends(verify_api_key)
):
    """
    Get invoice by ID.
    
    - **invoice_id**: Invoice ID (format: INV-YYYY-XXX)
    
    Returns invoice with all details and line items.
    """
    invoice = invoice_service.get_invoice(invoice_id)
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice {invoice_id} not found"
        )
    
    return ApiResponse(
        success=True,
        message="Invoice retrieved successfully",
        data=invoice.dict()
    )


@router.get(
    "",
    response_model=ApiResponse,
    summary="List all invoices",
    description="Get list of invoices with optional filtering and pagination"
)
async def list_invoices(
    status_filter: Optional[str] = Query(None, description="Filter by status (draft, pending, paid, overdue)"),
    client_id: Optional[str] = Query(None, description="Filter by client ID"),
    limit: int = Query(50, ge=1, le=100, description="Maximum results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    api_key: str = Depends(verify_api_key)
):
    """
    List invoices with optional filtering.
    
    - **status**: Filter by invoice status
    - **client_id**: Filter by client ID
    - **limit**: Maximum results (1-100, default 50)
    - **offset**: Pagination offset (default 0)
    
    Returns paginated list of invoices.
    """
    try:
        invoices, total = invoice_service.list_invoices(
            status=status_filter,
            client_id=client_id,
            limit=limit,
            offset=offset
        )
        
        response_data = {
            "invoices": [inv.dict() for inv in invoices],
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
        return ApiResponse(
            success=True,
            message=f"Retrieved {len(invoices)} invoices",
            data=response_data
        )
    
    except Exception as e:
        logger.error(f"Error listing invoices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve invoices"
        )


@router.patch(
    "/{invoice_id}/status",
    response_model=ApiResponse,
    summary="Update invoice status",
    description="Update the status of an existing invoice"
)
async def update_invoice_status(
    invoice_id: str,
    status_update: InvoiceStatusUpdate,
    api_key: str = Depends(verify_api_key)
):
    """
    Update invoice status.
    
    - **invoice_id**: Invoice ID
    - **status**: New status (draft, pending, paid, overdue)
    
    Returns success message.
    """
    success = invoice_service.update_status(invoice_id, status_update)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice {invoice_id} not found"
        )
    
    return ApiResponse(
        success=True,
        message=f"Invoice status updated to {status_update.status}",
        data={"invoice_id": invoice_id, "status": status_update.status}
    )
