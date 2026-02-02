"""
Task service for managing tasks in Google Sheets.
"""
from typing import List, Dict, Optional
from datetime import datetime
from app.services.sheets_service import SheetsService
from app.models.task import Task, TaskCreate, TaskUpdate


class TaskService:
    """Service for task management operations."""
    
    def __init__(self, sheets: SheetsService):
        self.sheets = sheets
        self.sheet_name = "Tasks"
    
    def _generate_task_id(self) -> str:
        """Generate unique task ID."""
        tasks = self.sheets.get_all_rows(self.sheet_name)
        
        if not tasks:
            return "T001"
        
        # Extract numeric part from existing IDs
        max_num = 0
        for task in tasks:
            task_id = task.get('task_id', '')
            if task_id and task_id.startswith('T'):
                try:
                    num = int(task_id[1:])
                    max_num = max(max_num, num)
                except ValueError:
                    continue
        
        return f"T{str(max_num + 1).zfill(3)}"
    
    def list_tasks(self, status_filter: Optional[str] = None) -> List[Task]:
        """
        List all tasks, optionally filtered by status.
        
        Args:
            status_filter: Optional status to filter by
            
        Returns:
            List of Task objects
        """
        rows = self.sheets.get_all_rows(self.sheet_name)
        
        tasks = []
        for row in rows:
            # Filter by status if provided
            if status_filter and row.get('status') != status_filter:
                continue
            
            task = Task(
                task_id=row.get('task_id', ''),
                title=row.get('title', ''),
                description=row.get('description', ''),
                status=row.get('status', 'todo'),
                priority=row.get('priority', 'medium'),
                assigned_to=row.get('assigned_to', ''),
                client_id=row.get('client_id', ''),
                invoice_id=row.get('invoice_id', ''),
                due_date=row.get('due_date', ''),
                created_date=row.get('created_date', ''),
                updated_date=row.get('updated_date', '')
            )
            tasks.append(task)
        
        return tasks
    
    def get_task(self, task_id: str) -> Optional[Task]:
        """
        Get a specific task by ID.
        
        Args:
            task_id: Task ID to retrieve
            
        Returns:
            Task object or None if not found
        """
        row = self.sheets.find_row(self.sheet_name, 'task_id', task_id)
        
        if not row:
            return None
        
        return Task(
            task_id=row.get('task_id', ''),
            title=row.get('title', ''),
            description=row.get('description', ''),
            status=row.get('status', 'todo'),
            priority=row.get('priority', 'medium'),
            assigned_to=row.get('assigned_to', ''),
            client_id=row.get('client_id', ''),
            invoice_id=row.get('invoice_id', ''),
            due_date=row.get('due_date', ''),
            created_date=row.get('created_date', ''),
            updated_date=row.get('updated_date', '')
        )
    
    def create_task(self, task_data: TaskCreate) -> Task:
        """
        Create a new task.
        
        Args:
            task_data: Task creation data
            
        Returns:
            Created Task object
        """
        task_id = self._generate_task_id()
        now = datetime.now().isoformat()
        
        # Prepare row data as dictionary
        row = {
            "task_id": task_id,
            "title": task_data.title,
            "description": task_data.description or "",
            "status": task_data.status,
            "priority": task_data.priority,
            "assigned_to": task_data.assigned_to or "",
            "client_id": task_data.client_id or "",
            "invoice_id": task_data.invoice_id or "",
            "due_date": task_data.due_date or "",
            "created_date": now,
            "updated_date": now
        }
        
        # Append to sheet
        success = self.sheets.append_row(self.sheet_name, row)
        
        if not success:
            raise Exception("Failed to create task in Google Sheets")
        
        return Task(**row)
    
    def update_task(self, task_id: str, task_data: TaskUpdate) -> Optional[Task]:
        """
        Update an existing task.
        
        Args:
            task_id: Task ID to update
            task_data: Updated task data
            
        Returns:
            Updated Task object or None if not found
        """
        # Build update dictionary with only provided fields
        updates = {}
        if task_data.title is not None:
            updates['title'] = task_data.title
        if task_data.description is not None:
            updates['description'] = task_data.description
        if task_data.status is not None:
            updates['status'] = task_data.status
        if task_data.priority is not None:
            updates['priority'] = task_data.priority
        if task_data.assigned_to is not None:
            updates['assigned_to'] = task_data.assigned_to
        if task_data.client_id is not None:
            updates['client_id'] = task_data.client_id
        if task_data.invoice_id is not None:
            updates['invoice_id'] = task_data.invoice_id
        if task_data.due_date is not None:
            updates['due_date'] = task_data.due_date
        
        # Always update the updated_date
        updates['updated_date'] = datetime.now().isoformat()
        
        # Update in sheets
        success = self.sheets.update_row(self.sheet_name, 'task_id', task_id, updates)
        
        if not success:
            return None
        
        # Return updated task
        return self.get_task(task_id)
    
    def update_task_status(self, task_id: str, new_status: str) -> Optional[Task]:
        """
        Update only the status of a task (for drag-drop).
        
        Args:
            task_id: Task ID to update
            new_status: New status value
            
        Returns:
            Updated Task object or None if not found
        """
        updates = {
            'status': new_status,
            'updated_date': datetime.now().isoformat()
        }
        
        success = self.sheets.update_row(self.sheet_name, 'task_id', task_id, updates)
        
        if not success:
            return None
        
        return self.get_task(task_id)
    
    def delete_task(self, task_id: str) -> bool:
        """
        Delete a task.
        
        Args:
            task_id: Task ID to delete
            
        Returns:
            True if deleted, False otherwise
        """
        return self.sheets.delete_row(self.sheet_name, 'task_id', task_id)
