"""
Check what's actually in Google Sheets right now for both Clients and Invoices.
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.sheets_service import SheetsService
from app.core.config import settings

sheets = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)

print("\n" + "="*80)
print("CLIENTS IN GOOGLE SHEETS")
print("="*80)
clients = sheets.get_all_rows("Clients")
for i, c in enumerate(clients, 1):
    print(f"{i}. {c.get('client_id', 'NO_ID'):10s} | {c.get('name', 'NO_NAME')}")

print("\n" + "="*80)
print("INVOICES IN GOOGLE SHEETS")
print("="*80)
invoices = sheets.get_all_rows("Invoices")
for i, inv in enumerate(invoices, 1):
    inv_id = inv.get('invoice_id', 'NO_ID')
    client_id = inv.get('client_id', 'NO_ID')
    client_name = inv.get('client_name', 'NO_NAME')
    total = inv.get('grand_total', '0')
    print(f"{i}. {inv_id:15s} | Client: {client_id:10s} | {client_name:30s} | ₹{total}")

print("\n" + "="*80)
print("ORPHANED INVOICES (client doesn't exist)")
print("="*80)
client_ids = {c.get('client_id') for c in clients}
for inv in invoices:
    if inv.get('client_id') not in client_ids:
        print(f"❌ Invoice {inv.get('invoice_id')} → Client {inv.get('client_id')} | '{inv.get('client_name')}' NOT FOUND")
