"""
Task models for Operations Dashboard Kanban board.
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date


# Task status enum
TaskStatus = Literal["todo", "in_progress", "review", "done"]
TaskPriority = Literal["low", "medium", "high", "urgent"]


class TaskBase(BaseModel):
    """Base task model with common fields."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: TaskStatus = "todo"
    priority: TaskPriority = "medium"
    assigned_to: Optional[str] = None
    client_id: Optional[str] = None
    invoice_id: Optional[str] = None
    due_date: Optional[str] = None  # ISO format YYYY-MM-DD


class TaskCreate(TaskBase):
    """Model for creating a new task."""
    pass


class TaskUpdate(BaseModel):
    """Model for updating an existing task."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    assigned_to: Optional[str] = None
    client_id: Optional[str] = None
    invoice_id: Optional[str] = None
    due_date: Optional[str] = None


class TaskStatusUpdate(BaseModel):
    """Model for updating task status (drag-drop)."""
    status: TaskStatus


class Task(TaskBase):
    """Complete task model with all fields."""
    task_id: str
    created_date: str
    updated_date: str

    class Config:
        from_attributes = True
