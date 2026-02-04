"""
Delete orphaned invoices (invoices whose clients no longer exist).
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
print("CLEANING UP ORPHANED INVOICES")
print("="*80)

# Get all clients
clients = sheets.get_all_rows("Clients")
client_ids = {c.get('client_id') for c in clients if c.get('client_id')}
print(f"\n✓ Found {len(clients)} clients with IDs: {sorted(client_ids)}")

# Get all invoices
invoices = sheets.get_all_rows("Invoices")
print(f"✓ Found {len(invoices)} invoices")

# Find orphaned invoices
orphaned = []
for inv in invoices:
    client_id = inv.get('client_id')
    if client_id and client_id not in client_ids:
        orphaned.append(inv)
        print(f"\n❌ ORPHAN: Invoice {inv.get('invoice_id')} → Client {client_id} ('{inv.get('client_name')}') NOT FOUND")

if not orphaned:
    print("\n✅ No orphaned invoices found!")
else:
    print(f"\n📝 Found {len(orphaned)} orphaned invoices")
    print("\nDeleting orphaned invoices...")
    
    deleted = 0
    for inv in orphaned:
        try:
            # Delete by removing the row
            success = sheets.delete_row("Invoices", "invoice_id", inv.get('invoice_id'))
            if success:
                print(f"  ✅ Deleted: {inv.get('invoice_id')}")
                deleted += 1
            else:
                print(f"  ❌ Failed to delete: {inv.get('invoice_id')}")
        except Exception as e:
            print(f"  ❌ Error deleting {inv.get('invoice_id')}: {str(e)}")
    
    print(f"\n✅ Deleted {deleted} out of {len(orphaned)} orphaned invoices")

print("="*80)
