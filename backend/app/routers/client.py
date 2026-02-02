"""
Client API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.client import Client, ClientCreate
from app.services.client_service import ClientService
from app.services.sheets_service import SheetsService
from app.core.config import settings
from app.core.dependencies import verify_api_key
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/clients",
    tags=["clients"]
)

# Initialize services at module level
sheets_service = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)
client_service = ClientService(sheets_service)


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_data: ClientCreate,
    api_key: str = Depends(verify_api_key)
):
    """
    Create a new client.
    
    - **name**: Client/company name (required)
    - **contact**: Contact person name
    - **email**: Contact email address
    - **phone**: Contact phone number
    - **industry**: Industry/sector
    - **address**: Full address
    
    Returns the created client with auto-generated client_id.
    """
    try:
        logger.info(f"Creating client: {client_data.name}")
        client = client_service.create_client(client_data)
        logger.info(f"Client created successfully: {client.client_id}")
        
        return {
            "success": True,
            "message": f"Client {client.name} created successfully",
            "data": client.model_dump()
        }
    except ValueError as e:
        logger.error(f"Validation error creating client: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating client: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create client: {str(e)}"
        )


@router.get("", response_model=dict)
async def list_clients(
    limit: int = None,
    api_key: str = Depends(verify_api_key)
):
    """
    List all clients.
    
    - **limit**: Optional limit for number of clients to return
    
    Returns list of all clients with their details.
    """
    try:
        logger.info("Fetching clients list")
        clients = client_service.list_clients(limit=limit)
        logger.info(f"Retrieved {len(clients)} clients")
        
        return {
            "success": True,
            "count": len(clients),
            "data": [client.model_dump() for client in clients]
        }
    except Exception as e:
        logger.error(f"Error fetching clients: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch clients: {str(e)}"
        )


@router.get("/{client_id}", response_model=dict)
async def get_client(
    client_id: str,
    api_key: str = Depends(verify_api_key)
):
    """
    Get a specific client by ID.
    
    - **client_id**: Client ID (e.g., CLT001)
    
    Returns the client details if found.
    """
    try:
        logger.info(f"Fetching client: {client_id}")
        client = client_service.get_client(client_id)
        
        if not client:
            logger.warning(f"Client not found: {client_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Client {client_id} not found"
            )
        
        logger.info(f"Client found: {client_id}")
        return {
            "success": True,
            "data": client.model_dump()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching client {client_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch client: {str(e)}"
        )
