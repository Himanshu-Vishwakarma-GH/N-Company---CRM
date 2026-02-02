"""
Helper script to safely test client service with proper error handling
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.sheets_service import SheetsService
from app.core.config import settings

def safe_int(value, default=0):
    """Safely convert value to int."""
    try:
        if value is None or value == '' or value == 'None':
            return default
        return int(value)
    except (ValueError, TypeError):
        return default

def safe_float(value, default=0.0):
    """Safely convert value to float."""
    try:
        if value is None or value == '' or value == 'None':
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

# Test reading clients
sheets = SheetsService(settings.google_sheets_credentials_path, settings.spreadsheet_id)
rows = sheets.get_all_rows("Clients")

print(f"Found {len(rows)} clients")
print("\nClient data:")
for i, row_dict in enumerate(rows[:5], 1):  # Show first 5
    print(f"\nClient {i}:")
    print(f"  ID: {row_dict.get('client_id')}")
    print(f"  Name: {row_dict.get('name')}")
    print(f"  Industry: {row_dict.get('industry')}")
    print(f"  Total Invoices (raw): '{row_dict.get('total_invoices')}'")
    print(f"  Total Invoices (safe): {safe_int(row_dict.get('total_invoices'))}")
    print(f"  Total Revenue (raw): '{row_dict.get('total_revenue')}'")
    print(f"  Total Revenue (safe): {safe_float(row_dict.get('total_revenue'))}")
