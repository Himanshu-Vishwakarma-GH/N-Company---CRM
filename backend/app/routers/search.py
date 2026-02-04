"""
Search router for searching across clients and invoices.
"""
from fastapi import APIRouter, Depends, Query
from typing import List, Optional, Dict, Any
from app.core.dependencies import verify_api_key
from app.services.sheets_service import SheetsService
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/search", tags=["search"])

# Initialize sheets service
sheets_service = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)


def search_clients(query: str) -> List[Dict[str, Any]]:
    """
    Search clients by ID, name, email, or phone.
    
    Args:
        query: Search query string
        
    Returns:
        List of matching clients
    """
    try:
        all_clients = sheets_service.get_all_rows("Clients")
        query_lower = query.lower()
        
        results = []
        for client in all_clients:
            # Search in client_id, name, email, phone
            if (
                query_lower in client.get('client_id', '').lower() or
                query_lower in client.get('name', '').lower() or
                query_lower in client.get('email', '').lower() or
                query_lower in client.get('phone', '').lower()
            ):
                results.append({
                    'type': 'client',
                    'id': client.get('client_id', ''),
                    'name': client.get('name', ''),
                    'email': client.get('email', ''),
                    'phone': client.get('phone', ''),
                    'company': client.get('company', '')
                })
        
        return results
    except Exception as e:
        logger.error(f"Error searching clients: {e}")
        return []


def search_invoices(query: str) -> List[Dict[str, Any]]:
    """
    Search invoices by invoice ID or client ID.
    
    Args:
        query: Search query string
        
    Returns:
        List of matching invoices
    """
    try:
        all_invoices = sheets_service.get_all_rows("Invoices")
        query_lower = query.lower()
        
        results = []
        for invoice in all_invoices:
            # Search in invoice_id, client_id
            if (
                query_lower in invoice.get('invoice_id', '').lower() or
                query_lower in invoice.get('client_id', '').lower()
            ):
                results.append({
                    'type': 'invoice',
                    'id': invoice.get('invoice_id', ''),
                    'client_id': invoice.get('client_id', ''),
                    'client_name': invoice.get('client_name', ''),
                    'grand_total': float(invoice.get('grand_total', 0)),
                    'status': invoice.get('status', ''),
                    'invoice_date': invoice.get('invoice_date', '')
                })
        
        return results
    except Exception as e:
        logger.error(f"Error searching invoices: {e}")
        return []


@router.get("")
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    type: Optional[str] = Query(None, description="Filter by type: 'client', 'invoice', or 'all'"),
    limit: int = Query(10, ge=1, le=50, description="Maximum results to return"),
    api_key: str = Depends(verify_api_key)
):
    """
    Search across clients and invoices.
    
    Query parameters:
    - q: Search query (required)
    - type: Filter by 'client', 'invoice', or 'all' (optional, default: 'all')
    - limit: Max results per type (optional, default: 10)
    
    Returns:
    {
        "query": "search term",
        "results": {
            "clients": [...],
            "invoices": [...]
        },
        "total": 15
    }
    """
    try:
        results = {
            "clients": [],
            "invoices": []
        }
        
        # Search clients
        if type is None or type == "all" or type == "client":
            client_results = search_clients(q)
            results["clients"] = client_results[:limit]
        
        # Search invoices
        if type is None or type == "all" or type == "invoice":
            invoice_results = search_invoices(q)
            results["invoices"] = invoice_results[:limit]
        
        total = len(results["clients"]) + len(results["invoices"])
        
        return {
            "success": True,
            "query": q,
            "results": results,
            "total": total
        }
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        return {
            "success": False,
            "query": q,
            "results": {
                "clients": [],
                "invoices": []
            },
            "total": 0,
            "error": str(e)
        }
