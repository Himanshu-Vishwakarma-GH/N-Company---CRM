"""
Check and setup Clients sheet in Google Sheets.
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.sheets_service import SheetsService
from app.core.config import settings

def main():
    print("Checking Google Sheets configuration...")
    print(f"Spreadsheet ID: {settings.spreadsheet_id}")
    print(f"Credentials path: {settings.google_sheets_credentials_path}")
    
    # Initialize sheets service with proper parameters
    sheets = SheetsService(
        credentials_path=settings.google_sheets_credentials_path,
        spreadsheet_id=settings.spreadsheet_id
    )
    
    # Get all sheet names
    print("\nFetching sheet names...")
    try:
        spreadsheet = sheets.service.spreadsheets().get(
            spreadsheetId=settings.spreadsheet_id
        ).execute()
        
        sheet_names = [sheet['properties']['title'] for sheet in spreadsheet['sheets']]
        print(f"Existing sheets: {sheet_names}")
        
        # Check if Clients sheet exists
        if "Clients" in sheet_names:
            print("\n✓ 'Clients' sheet exists!")
            
            # Get current data
            print("\nFetching Clients sheet data...")
            rows = sheets.get_all_rows("Clients")
            print(f"Number of rows: {len(rows)}")
            
            if rows:
                print(f"Header row: {rows[0]}")
                if len(rows) > 1:
                    print(f"Sample data (first row): {rows[1]}")
            else:
                print("WARNING: Clients sheet is empty - no header row!")
                print("\nAdding header row...")
                header = [
                    "client_id", "name", "contact", "email", "phone", 
                    "industry", "address", "created_date", "total_invoices", "total_revenue"
                ]
                sheets.append_row("Clients", header)
                print("✓ Header row added!")
                
        else:
            print("\n✗ 'Clients' sheet does NOT exist!")
            print("\nCreating 'Clients' sheet...")
            
            # Create the sheet
            request = {
                'addSheet': {
                    'properties': {
                        'title': 'Clients'
                    }
                }
            }
            
            sheets.service.spreadsheets().batchUpdate(
                spreadsheetId=settings.spreadsheet_id,
                body={'requests': [request]}
            ).execute()
            
            print("✓ 'Clients' sheet created!")
            
            # Add header row
            print("\nAdding header row...")
            header = [
                "client_id", "name", "contact", "email", "phone",
                "industry", "address", "created_date", "total_invoices", "total_revenue"
            ]
            sheets.append_row("Clients", header)
            print("✓ Header row added!")
            
        print("\n✅ Google Sheets is ready for client data!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
