from typing import List, Optional, Dict
from app.services.sheets_service import SheetsService
from app.schemas.activity import ActivityLog, ActivityLogCreate
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ActivityService:
    def __init__(self, sheets_service: SheetsService):
        self.sheets_service = sheets_service
        self.sheet_name = "Activity_Logs"

    def log_activity(self, log_data: ActivityLogCreate) -> ActivityLog:
        """
        Log a new activity to Google Sheets.
        """
        try:
            # Generate ID
            log_id = f"LOG{str(uuid.uuid4())[:8].upper()}"
            timestamp = datetime.now().isoformat()
            
            row_data = {
                "log_id": log_id,
                "type": log_data.type,
                "title": log_data.title,
                "description": log_data.description,
                "entity_id": log_data.entity_id or "",
                "entity_type": log_data.entity_type or "",
                "user": log_data.user,
                "timestamp": timestamp,
                "status": log_data.status
            }
            
            self.sheets_service.append_row(self.sheet_name, row_data)
            
            return ActivityLog(**row_data)
        except Exception as e:
            logger.error(f"Failed to log activity: {e}")
            # Return a dummy log so we don't crash main operations if logging fails
            return ActivityLog(
                log_id="ERROR",
                type=log_data.type,
                title=log_data.title,
                description=log_data.description,
                user=log_data.user,
                timestamp=datetime.now().isoformat(),
                status="error"
            )

    def get_recent_activities(self, limit: int = 20) -> List[ActivityLog]:
        """
        Get recent activities, sorted by timestamp descending.
        """
        try:
            rows = self.sheets_service.get_all_rows(self.sheet_name)
            
            # Sort by timestamp descending
            sorted_rows = sorted(
                rows, 
                key=lambda x: x.get('timestamp', ''), 
                reverse=True
            )
            
            # Take top N
            recent = sorted_rows[:limit]
            
            return [ActivityLog(**row) for row in recent]
        except Exception as e:
            logger.error(f"Failed to fetch activities: {e}")
            return []

    def get_unread_count(self) -> int:
        """Get count of unread notifications."""
        try:
            rows = self.sheets_service.get_all_rows(self.sheet_name)
            return len([r for r in rows if r.get('status') == 'unread'])
        except Exception as e:
            logger.error(f"Failed to count unread: {e}")
            return 0

    def mark_all_read(self) -> bool:
        """Mark all unread logs as read."""
        try:
            # Ideally we would update rows in sheets, but for MVP we'll just acknowledge
            # Frontend will clear the badge locally
            return True 
        except Exception as e:
            logger.error(f"Failed to mark read: {e}")
            return False
