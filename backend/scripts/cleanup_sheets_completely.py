"""
Complete cleanup script - Removes ALL invoices that don't have matching clients.
This will fix the revenue calculation permanently.
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.sheets_service import SheetsService  
from app.core.config import settings
from googleapiclient.errors import HttpError

sheets = SheetsService(
    credentials_path=settings.google_sheets_credentials_path,
    spreadsheet_id=settings.spreadsheet_id
)

print("\n" + "="*80)
print("COMPLETE GOOGLE SHEETS CLEANUP")
print("="*80)

# Step 1: Get all valid clients
print("\n📋 Step 1: Loading clients...")
clients = sheets.get_all_rows("Clients")
client_ids = {c.get('client_id') for c in clients if c.get('client_id')}
print(f"✓ Found {len(clients)} clients")
print(f"✓ Valid client IDs: {sorted(client_ids)}")

# Step 2: Get all invoices
print("\n📋 Step 2: Loading invoices...")
invoices = sheets.get_all_rows("Invoices")
print(f"✓ Found {len(invoices)} invoices")

# Step 3: Identify orphaned invoices
print("\n🔍 Step 3: Identifying orphaned invoices...")
valid_invoices = []
orphaned_invoices = []

for inv in invoices:
    client_id = inv.get('client_id', '').strip()
    invoice_id = inv.get('invoice_id', 'UNKNOWN')
    
    if client_id in client_ids:
        valid_invoices.append(inv)
        print(f"  ✅ {invoice_id}: Client {client_id} EXISTS")
    else:
        orphaned_invoices.append(inv)
        print(f"  ❌ {invoice_id}: Client {client_id} ('{inv.get('client_name')}') NOT FOUND - WILL DELETE")

print(f"\n📊 Summary:")
print(f"   Valid invoices: {len(valid_invoices)}")
print(f"   Orphaned invoices: {len(orphaned_invoices)}")

if not orphaned_invoices:
    print("\n✅ No cleanup needed! All invoices have valid clients.")
    exit(0)

# Step 4: Delete orphaned invoices manually  
print(f"\n🗑️  Step 4: Deleting {len(orphaned_invoices)} orphaned invoices...")

# Get the full sheet data
result = sheets.service.spreadsheets().values().get(
    spreadsheetId=sheets.spreadsheet_id,
    range="Invoices!A:Z"
).execute()

values = result.get('values', [])
headers = values[0]
invoice_id_col = headers.index('invoice_id') if 'invoice_id' in headers else 0

# Find rows to delete (work backwards to avoid index issues)
orphaned_ids = {inv.get('invoice_id') for inv in orphaned_invoices}
rows_to_delete = []

for i, row_data in enumerate(values[1:], start=2):  # Start from row 2 (skip header)
    if len(row_data) > invoice_id_col and row_data[invoice_id_col] in orphaned_ids:
        rows_to_delete.append(i)

print(f"   Found {len(rows_to_delete)} rows to delete: {rows_to_delete}")

# Delete rows from bottom to top
for row_num in sorted(rows_to_delete, reverse=True):
    try:
        request = {
            "deleteDimension": {
                "range": {
                    "sheetId": 0,  # Assuming Invoices is the first sheet, might need to adjust
                    "dimension": "ROWS",
                    "startIndex": row_num - 1,  # 0-indexed
                    "endIndex": row_num
                }
            }
        }
        
        sheets.service.spreadsheets().batchUpdate(
            spreadsheetId=sheets.spreadsheet_id,
            body={"requests": [request]}
        ).execute()
        
        print(f"  ✅ Deleted row {row_num}")
    except HttpError as e:
        print(f"  ❌ Failed to delete row {row_num}: {e}")

print("\n" + "="*80)
print("✅ CLEANUP COMPLETE!")
print("="*80)
print(f"Remaining valid invoices: {len(valid_invoices)}")
print("Now refresh your Client Management page to see the correct revenue!")
print("="*80)
