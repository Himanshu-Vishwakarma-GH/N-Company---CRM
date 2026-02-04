"""
Direct fix for client_ids - manually update each invoice in Google Sheets.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.sheets_service import SheetsService
from app.core.config import settings

def direct_fix():
    sheets = SheetsService(
        credentials_path=settings.google_sheets_credentials_path,
        spreadsheet_id=settings.spreadsheet_id
    )
    
    print("\n" + "="*80)
    print("DIRECT CLIENT_ID FIX")
    print("="*80)
    
    # Get all clients
    clients = sheets.get_all_rows("Clients")
    print(f"\n✓ Found {len(clients)} clients")
    
    # Create name->id mapping (with normalized names)
    client_map = {}
    for c in clients:
        if c.get('name') and c.get('client_id'):
            # Store both with original case and lowercase
            name = c['name'].strip()
            name_lower = name.lower()
            client_id = c['client_id'].strip()
            client_map[name_lower] = client_id
            print(f"  {client_id}: {name}")
    
    # Get all invoices
    invoices = sheets.get_all_rows("Invoices")
    print(f"\n✓ Found {len(invoices)} invoices")
    
    # Show what needs fixing
    print("\n" + "="*80)
    print("ANALYSIS")
    print("="*80)
    
    to_fix = []
    for inv in invoices:
        inv_id = inv.get('invoice_id', '').strip()
        inv_client_id = inv.get('client_id', '').strip()
        inv_client_name = inv.get('client_name', '').strip()
        
        if not inv_client_name:
            continue
            
        # Find correct client_id
        correct_id = client_map.get(inv_client_name.lower())
        
        if correct_id and correct_id != inv_client_id:
            to_fix.append({
                'invoice_id': inv_id,
                'current_id': inv_client_id,
                'correct_id': correct_id,
                'client_name': inv_client_name
            })
            print(f"NEEDS FIX: {inv_id} | '{inv_client_name}' | {inv_client_id} → {correct_id}")
        elif correct_id:
            print(f"OK: {inv_id} | '{inv_client_name}' | {inv_client_id}")
        else:
            print(f"NO MATCH: {inv_id} | '{inv_client_name}' | Client not found in Clients sheet")
    
    if not to_fix:
        print("\n✅ All invoices have correct client_ids!")
        return
    
    print(f"\n📝 Need to fix {len(to_fix)} invoices")
    print("\nProceeding with fixes...")
    
    # Fix each one
    fixed = 0
    for item in to_fix:
        try:
            success = sheets.update_row(
                sheet_name="Invoices",
                key="invoice_id",
                value=item['invoice_id'],
                data={"client_id": item['correct_id']}
            )
            if success:
                print(f"  ✅ {item['invoice_id']}: {item['current_id']} → {item['correct_id']}")
                fixed += 1
            else:
                print(f"  ❌ {item['invoice_id']}: Failed to update")
        except Exception as e:
            print(f"  ❌ {item['invoice_id']}: Error - {str(e)}")
    
    print("\n" + "="*80)
    print(f"✅ Fixed {fixed} out of {len(to_fix)} invoices")
    print("="*80)

if __name__ == "__main__":
    direct_fix()
