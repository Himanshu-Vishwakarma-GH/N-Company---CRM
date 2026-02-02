"""
Dashboard router for aggregated metrics.
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.core.dependencies import verify_api_key
from app.services.sheets_service import SheetsService
from app.services.dashboard_service import DashboardService
from app.core.config import settings

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Initialize services at module level
sheets_service = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)
dashboard_service = DashboardService(sheets_service)


@router.get("/executive")
async def get_executive_dashboard(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    api_key: str = Depends(verify_api_key)
):
    """
    Get executive dashboard metrics.
    
    Returns KPIs, revenue trends, growth rates, and top clients.
    """
    try:
        metrics = dashboard_service.get_executive_metrics(start_date, end_date)
        return {
            "success": True,
            "data": metrics
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/sales")
async def get_sales_dashboard(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    api_key: str = Depends(verify_api_key)
):
    """
    Get sales dashboard metrics.
    
    Returns sales totals, trends, and salesperson leaderboard.
    """
    try:
        metrics = dashboard_service.get_sales_metrics(start_date, end_date)
        return {
            "success": True,
            "data": metrics
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/financial")
async def get_financial_dashboard(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    api_key: str = Depends(verify_api_key)
):
    """
    Get financial dashboard metrics.
    
    Returns revenue, tax, discounts, and payment status breakdown.
    """
    try:
        metrics = dashboard_service.get_financial_metrics(start_date, end_date)
        return {
            "success": True,
            "data": metrics
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
