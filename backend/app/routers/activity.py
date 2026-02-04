"""
API Router for Activity Logs.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.schemas.activity import ActivityLog
from app.services.activity_service import ActivityService
from app.services.sheets_service import SheetsService
from app.core.config import settings
from app.core.dependencies import verify_api_key
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/activities",
    tags=["activities"],
    dependencies=[Depends(verify_api_key)]
)

# Initialize services
sheets_service = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)
activity_service = ActivityService(sheets_service)


@router.get("", response_model=dict)
async def list_activities(
    limit: Optional[int] = Query(50, ge=1, le=100)
):
    """
    List recent activities.
    """
    try:
        activities = activity_service.get_recent_activities(limit)
        
        return {
            "success": True,
            "data": [activity.dict() for activity in activities]
        }
    except Exception as e:
        logger.error(f"Error fetching activities: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/unread-count", response_model=dict)
async def get_unread_count():
    """
    Get number of unread activities.
    """
    try:
        count = activity_service.get_unread_count()
        return {
            "success": True,
            "count": count
        }
    except Exception as e:
        logger.error(f"Error counting unread: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/mark-read", response_model=dict)
async def mark_all_read():
    """
    Mark all activities as read.
    """
    try:
        success = activity_service.mark_all_read()
        return {
            "success": success,
            "message": "All activities marked as read"
        }
    except Exception as e:
        logger.error(f"Error marking read: {e}")
        raise HTTPException(status_code=500, detail=str(e))
