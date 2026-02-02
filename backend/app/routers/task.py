"""
Task router for Operations Dashboard tasks.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from app.core.dependencies import verify_api_key
from app.services.sheets_service import SheetsService
from app.services.task_service import TaskService
from app.models.task import Task, TaskCreate, TaskUpdate, TaskStatusUpdate
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Initialize services
sheets_service = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)
task_service = TaskService(sheets_service)


@router.get("", response_model=List[Task])
async def list_tasks(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    api_key: str = Depends(verify_api_key)
):
    """
    List all tasks with optional status filter.
    """
    try:
        tasks = task_service.list_tasks(status_filter)
        return tasks
    except Exception as e:
        logger.error(f"Error listing tasks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list tasks: {str(e)}"
        )


@router.get("/{task_id}", response_model=Task)
async def get_task(
    task_id: str,
    api_key: str = Depends(verify_api_key)
):
    """
    Get a specific task by ID.
    """
    try:
        task = task_service.get_task(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task {task_id} not found"
            )
        return task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting task {task_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get task: {str(e)}"
        )


@router.post("", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    api_key: str = Depends(verify_api_key)
):
    """
    Create a new task.
    """
    try:
        task = task_service.create_task(task_data)
        logger.info(f"Created task: {task.task_id}")
        return task
    except Exception as e:
        logger.error(f"Error creating task: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )


@router.patch("/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    api_key: str = Depends(verify_api_key)
):
    """
    Update an existing task.
    """
    try:
        task = task_service.update_task(task_id, task_data)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task {task_id} not found"
            )
        logger.info(f"Updated task: {task_id}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating task {task_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )


@router.patch("/{task_id}/status", response_model=Task)
async def update_task_status(
    task_id: str,
    status_update: TaskStatusUpdate,
    api_key: str = Depends(verify_api_key)
):
    """
    Update task status (for drag-drop operations).
    """
    try:
        task = task_service.update_task_status(task_id, status_update.status)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task {task_id} not found"
            )
        logger.info(f"Updated task {task_id} status to {status_update.status}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating task status {task_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task status: {str(e)}"
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    api_key: str = Depends(verify_api_key)
):
    """
    Delete a task.
    """
    try:
        success = task_service.delete_task(task_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task {task_id} not found"
            )
        logger.info(f"Deleted task: {task_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting task {task_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )
