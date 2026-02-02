"""
Fix Clients sheet headers to match backend expectations.
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.sheets_service import SheetsService
from app.core.config import settings

def main():
    print("Fixing Clients sheet headers...")
    print(f"Spreadsheet ID: {settings.spreadsheet_id}")
    
    # Initialize sheets service
    sheets = SheetsService(
        credentials_path=settings.google_sheets_credentials_path,
        spreadsheet_id=settings.spreadsheet_id
    )
    
    # Define correct headers for our backend
    correct_headers = [
        "client_id",
        "name",
        "contact",
        "email",
        "phone",
        "industry",
        "address",
        "created_date",
        "total_invoices",
        "total_revenue"
    ]
    
    print(f"\nUpdating headers to: {correct_headers}")
    
    # Update the header row (row 1)
    body = {
        'values': [correct_headers]
    }
    
    sheets.service.spreadsheets().values().update(
        spreadsheetId=settings.spreadsheet_id,
        range="Clients!A1:J1",
        valueInputOption='RAW',
        body=body
    ).execute()
    
    print("✅ Headers updated successfully!")
    
    # Now test by adding a client
    print("\nTesting by adding a test client...")
    test_client = {
        "client_id": "CLT015",
        "name": "Success Test Client",
        "contact": "Jane Doe",
        "email": "jane@success.com",
        "phone": "+91-99999-88888",
        "industry": "IT Services",
        "address": "New Delhi, India",
        "created_date": "2026-02-02",
        "total_invoices": "0",
        "total_revenue": "0.0"
    }
    
    success = sheets.append_row("Clients", test_client)
    
    if success:
        print("✅ Test client added successfully!")
        print("Check your Google Sheet now - CLT015 should be visible!")
    else:
        print("❌ Failed to add test client")

if __name__ == "__main__":
    main()
