"""
Script to setup Tasks sheet in Google Sheets with sample data.
"""
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.sheets_service import SheetsService
from app.core.config import settings
from datetime import datetime, timedelta


def setup_tasks_sheet():
    """Setup Tasks sheet with headers and sample data."""
    
    # Initialize sheets service
    sheets = SheetsService(
        credentials_path=settings.google_sheets_credentials_path,
        spreadsheet_id=settings.spreadsheet_id
    )
    
    print("Setting up Tasks sheet...")
    
    # Define headers
    headers = [
        "task_id",
        "title",
        "description",
        "status",
        "priority",
        "assigned_to",
        "client_id",
        "invoice_id",
        "due_date",
        "created_date",
        "updated_date"
    ]
    
    # Create/update sheet headers
    try:
        sheets.create_sheet("Tasks", headers)
        print("✓ Tasks sheet created with headers")
    except Exception as e:
        print(f"Sheet might already exist: {e}")
    
    # Sample task data
    now = datetime.now()
    tasks = [
        {
            "task_id": "T001",
            "title": "Process Invoice #I001",
            "description": "Complete invoice processing and send to client for review",
            "status": "in_progress",
            "priority": "high",
            "assigned_to": "Rajesh Kumar",
            "client_id": "C001",
            "invoice_id": "I001",
            "due_date": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
            "created_date": now.isoformat(),
            "updated_date": now.isoformat()
        },
        {
            "task_id": "T002",
            "title": "Client Follow-up - Acme Corp",
            "description": "Follow up with Acme Corp regarding pending payment",
            "status": "todo",
            "priority": "medium",
            "assigned_to": "Priya Sharma",
            "client_id": "C001",
            "invoice_id": "",
            "due_date": (now + timedelta(days=3)).strftime("%Y-%m-%d"),
            "created_date": now.isoformat(),
            "updated_date": now.isoformat()
        },
        {
            "task_id": "T003",
            "title": "Invoice Quality Review",
            "description": "Review all draft invoices for accuracy before sending",
            "status": "review",
            "priority": "urgent",
            "assigned_to": "Amit Patel",
            "client_id": "",
            "invoice_id": "",
            "due_date": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
            "created_date": (now - timedelta(days=1)).isoformat(),
            "updated_date": now.isoformat()
        },
        {
            "task_id": "T004",
            "title": "Payment Collection - Invoice I002",
            "description": "Collect payment for completed invoice",
            "status": "done",
            "priority": "high",
            "assigned_to": "Rajesh Kumar",
            "client_id": "C002",
            "invoice_id": "I002",
            "due_date": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
            "created_date": (now - timedelta(days=3)).isoformat(),
            "updated_date": now.isoformat()
        },
        {
            "task_id": "T005",
            "title": "Update Client Database",
            "description": "Update client contact information and preferences",
            "status": "todo",
            "priority": "low",
            "assigned_to": "Neha Singh",
            "client_id": "",
            "invoice_id": "",
            "due_date": (now + timedelta(days=5)).strftime("%Y-%m-%d"),
            "created_date": now.isoformat(),
            "updated_date": now.isoformat()
        },
        {
            "task_id": "T006",
            "title": "Prepare Monthly Report",
            "description": "Compile and prepare monthly financial report for management",
            "status": "in_progress",
            "priority": "medium",
            "assigned_to": "Amit Patel",
            "client_id": "",
            "invoice_id": "",
            "due_date": (now + timedelta(days=4)).strftime("%Y-%m-%d"),
            "created_date": now.isoformat(),
            "updated_date": now.isoformat()
        },
        {
            "task_id": "T007",
            "title": "New Client Onboarding - TechCorp",
            "description": "Complete onboarding process for new client TechCorp",
            "status": "todo",
            "priority": "high",
            "assigned_to": "Priya Sharma",
            "client_id": "C003",
            "invoice_id": "",
            "due_date": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
            "created_date": now.isoformat(),
            "updated_date": now.isoformat()
        },
        {
            "task_id": "T008",
            "title": "Invoice Template Update",
            "description": "Update invoice template with new company branding",
            "status": "review",
            "priority": "low",
            "assigned_to": "Neha Singh",
            "client_id": "",
            "invoice_id": "",
            "due_date": (now + timedelta(days=7)).strftime("%Y-%m-%d"),
            "created_date": (now - timedelta(days=2)).isoformat(),
            "updated_date": now.isoformat()
        },
    ]
    
    # Add tasks to sheet
    for task in tasks:
        try:
            sheets.append_row("Tasks", task)
            print(f"✓ Added task: {task['task_id']} - {task['title']}")
        except Exception as e:
            print(f"✗ Failed to add task {task['task_id']}: {e}")
    
    print(f"\n✓ Setup complete! Added {len(tasks)} sample tasks")
    print("\nTask status breakdown:")
    print(f"  - To Do: {sum(1 for t in tasks if t['status'] == 'todo')}")
    print(f"  - In Progress: {sum(1 for t in tasks if t['status'] == 'in_progress')}")
    print(f"  - Review: {sum(1 for t in tasks if t['status'] == 'review')}")
    print(f"  - Done: {sum(1 for t in tasks if t['status'] == 'done')}")


if __name__ == "__main__":
    setup_tasks_sheet()
