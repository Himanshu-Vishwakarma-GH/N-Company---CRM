"""
Add sample ticket data to Support_Tickets sheet for testing.
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.sheets_service import SheetsService
from app.core.config import settings
from datetime import datetime, timedelta

sheets = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)

# Sample tickets with various statuses, priorities, and categories
sample_tickets = [
    {
        "ticket_id": "TKT001",
        "title": "Cannot access dashboard after login",
        "description": "User reports being stuck on loading screen after successful login",
        "client_id": "CLT020",
        "client_name": "Himanshu Skilled",
        "status": "open",
        "priority": "high",
        "assigned_to": "Rajesh Kumar",
        "category": "technical",
        "created_date": (datetime.now() - timedelta(days=1)).date().isoformat(),
        "updated_date": datetime.now().date().isoformat(),
        "resolved_date": ""
    },
    {
        "ticket_id": "TKT002",
        "title": "Invoice total calculation incorrect",
        "description": "Customer noticed that tax calculation is showing wrong amount on invoice #SMAP3000",
        "client_id": "CLT022",
        "client_name": "Client Test",
        "status": "in_progress",
        "priority": "critical",
        "assigned_to": "Priya Sharma",
        "category": "billing",
        "created_date": (datetime.now() - timedelta(days=2)).date().isoformat(),
        "updated_date": datetime.now().date().isoformat(),
        "resolved_date": ""
    },
    {
        "ticket_id": "TKT003",
        "title": "Request for PDF export feature",
        "description": "Client wants ability to export client list as PDF report",
        "client_id": "CLT021",
        "client_name": "nj",
        "status": "open",
        "priority": "low",
        "assigned_to": "Amit Patel",
        "category": "feature_request",
        "created_date": (datetime.now() - timedelta(days=3)).date().isoformat(),
        "updated_date": (datetime.now() - timedelta(days=3)).date().isoformat(),
        "resolved_date": ""
    },
    {
        "ticket_id": "TKT004",
        "title": "Unable to update client contact information",
        "description": "Edit button on client profile not responding",
        "client_id": "CLT023",
        "client_name": "N Company",
        "status": "resolved",
        "priority": "medium",
        "assigned_to": "Rajesh Kumar",
        "category": "technical",
        "created_date": (datetime.now() - timedelta(days=5)).date().isoformat(),
        "updated_date": datetime.now().date().isoformat(),
        "resolved_date": datetime.now().date().isoformat()
    },
    {
        "ticket_id": "TKT005",
        "title": "Question about subscription pricing",
        "description": "Client asking about enterprise plan features and pricing",
        "client_id": "CLT020",
        "client_name": "Himanshu Skilled",
        "status": "resolved",
        "priority": "low",
        "assigned_to": "Neha Singh",
        "category": "general",
        "created_date": (datetime.now() - timedelta(days=7)).date().isoformat(),
        "updated_date": (datetime.now() - timedelta(days=6)).date().isoformat(),
        "resolved_date": (datetime.now() - timedelta(days=6)).date().isoformat()
    },
    {
        "ticket_id": "TKT006",
        "title": "Dashboard loading very slow",
        "description": "Executive dashboard takes 30+ seconds to load with large dataset",
        "client_id": "CLT022",
        "client_name": "Client Test",
        "status": "in_progress",
        "priority": "high",
        "assigned_to": "Amit Patel",
        "category": "technical",
        "created_date": (datetime.now() - timedelta(days=1)).date().isoformat(),
        "updated_date": datetime.now().date().isoformat(),
        "resolved_date": ""
    },
    {
        "ticket_id": "TKT007",
        "title": "Add dark mode to mobile app",
        "description": "Feature request for dark theme option in mobile application",
        "client_id": "CLT021",
        "client_name": "nj",
        "status": "open",
        "priority": "medium",
        "assigned_to": "",
        "category": "feature_request",
        "created_date": (datetime.now() - timedelta(days=4)).date().isoformat(),
        "updated_date": (datetime.now() - timedelta(days=4)).date().isoformat(),
        "resolved_date": ""
    },
    {
        "ticket_id": "TKT008",
        "title": "Payment gateway integration issue",
        "description": "Razorpay webhook not triggering after successful payment",
        "client_id": "CLT023",
        "client_name": "N Company",
        "status": "open",
        "priority": "critical",
        "assigned_to": "Priya Sharma",
        "category": "billing",
        "created_date": datetime.now().date().isoformat(),
        "updated_date": datetime.now().date().isoformat(),
        "resolved_date": ""
    }
]

print("\n" + "="*80)
print("ADDING SAMPLE TICKET DATA")
print("="*80)

# Add each ticket
added = 0
for ticket in sample_tickets:
    try:
        success = sheets.append_row("Support_Tickets", ticket)
        if success:
            status_emoji = {
                'open': '🔴',
                'in_progress': '🔵',
                'resolved': '✅',
                'closed': '⚫'
            }.get(ticket['status'], '⚪')
            
            priority_emoji = {
                'critical': '🔥',
                'high': '⚠️',
                'medium': '📌',
                'low': '📝'
            }.get(ticket['priority'], '📋')
            
            print(f"{status_emoji} {priority_emoji} Added: {ticket['ticket_id']} - {ticket['title']}")
            added += 1
        else:
            print(f"❌ Failed: {ticket['ticket_id']}")
    except Exception as e:
        print(f"❌ Error adding {ticket['ticket_id']}: {e}")

print("\n" + "="*80)
print(f"✅ Successfully added {added} out of {len(sample_tickets)} tickets")
print("="*80)
print("\nNow refresh the Support Dashboard to see the tickets!")
print("You should see:")
print("  - Total Tickets: 8")
print("  - Open: 4 tickets")
print("  - In Progress: 2 tickets")
print("  - Resolved: 2 tickets")
print("  - Priority distribution in charts")
print("  - Category breakdown")
print("="*80)
