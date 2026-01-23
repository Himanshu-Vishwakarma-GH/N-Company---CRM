"""
Script to populate Google Sheets with sample client data.
Run this once to add initial test data to your CRM.
"""

from app.services.sheets_service import SheetsService
from app.core.config import settings
from datetime import datetime

# Sample clients data
SAMPLE_CLIENTS = [
    {
        "client_id": "CLT001",
        "name": "Acme Corporation",
        "contact": "Robert Taylor",
        "email": "robert.taylor@acmecorp.com",
        "phone": "+91-9876543210",
        "industry": "Technology",
        "stage": "repeat",
        "joined_date": "2024-08-15",
        "billing_address": "123 Tech Park, Sector 62, Noida, UP 201301",
        "shipping_address": "123 Tech Park, Sector 62, Noida, UP 201301",
        "created_at": "2024-08-15T10:00:00"
    },
    {
        "client_id": "CLT002",
        "name": "Tech Innovators Ltd",
        "contact": "Emma Wilson",
        "email": "emma@techinnovators.com",
        "phone": "+91-9876543211",
        "industry": "Software",
        "stage": "repeat",
        "joined_date": "2024-09-10",
        "billing_address": "45 Innovation Hub, Bangalore, KA 560001",
        "shipping_address": "45 Innovation Hub, Bangalore, KA 560001",
        "created_at": "2024-09-10T10:00:00"
    },
    {
        "client_id": "CLT003",
        "name": "Global Solutions Inc",
        "contact": "Michael Chen",
        "email": "michael@globalsolutions.com",
        "phone": "+91-9876543212",
        "industry": "Consulting",
        "stage": "converted",
        "joined_date": "2025-01-05",
        "billing_address": "78 Business District, Gurgaon, HR 122001",
        "shipping_address": "78 Business District, Gurgaon, HR 122001",
        "created_at": "2025-01-05T10:00:00"
    },
    {
        "client_id": "CLT004",
        "name": "MegaCorp Industries",
        "contact": "Lisa Davis",
        "email": "lisa@megacorp.com",
        "phone": "+91-9876543213",
        "industry": "Manufacturing",
        "stage": "completed",
        "joined_date": "2025-02-20",
        "billing_address": "234 Industrial Area, Pune, MH 411001",
        "shipping_address": "234 Industrial Area, Pune, MH 411001",
        "created_at": "2025-02-20T10:00:00"
    },
    {
        "client_id": "CLT005",
        "name": "StartupXYZ",
        "contact": "David Brown",
        "email": "david@startupxyz.com",
        "phone": "+91-9876543214",
        "industry": "E-commerce",
        "stage": "converted",
        "joined_date": "2025-10-15",
        "billing_address": "12 Startup Plaza, Mumbai, MH 400001",
        "shipping_address": "12 Startup Plaza, Mumbai, MH 400001",
        "created_at": "2025-10-15T10:00:00"
    }
]

def add_sample_clients():
    """Add sample clients to Google Sheets."""
    
    print("Initializing Google Sheets service...")
    sheets_service = SheetsService(
        credentials_path=settings.google_sheets_credentials_path,
        spreadsheet_id=settings.spreadsheet_id
    )
    
    print(f"\nAdding {len(SAMPLE_CLIENTS)} sample clients...\n")
    
    for client in SAMPLE_CLIENTS:
        try:
            sheets_service.append_row("Clients", client)
            print(f"✅ Added: {client['name']} ({client['client_id']})")
        except Exception as e:
            print(f"❌ Failed to add {client['name']}: {e}")
    
    print(f"\n🎉 Sample data setup complete!")
    print(f"\nYou can now:")
    print("1. Run the backend: uvicorn app.main:app --reload")
    print("2. Open Swagger UI: http://localhost:8000/docs")
    print("3. Create your first invoice using client CLT001")

if __name__ == "__main__":
    add_sample_clients()
