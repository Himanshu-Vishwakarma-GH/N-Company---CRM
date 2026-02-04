"""
Debug script to see exactly what client_names and client_ids are in both sheets.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.sheets_service import SheetsService
from app.core.config import settings

def debug_mapping():
    sheets = SheetsService(
        credentials_path=settings.google_sheets_credentials_path,
        spreadsheet_id=settings.spreadsheet_id
    )
    
    print("\n" + "="*80)
    print("CLIENTS SHEET")
    print("="*80)
    clients = sheets.get_all_rows("Clients")
    for i, client in enumerate(clients[:10], 1):  # Show first 10
        print(f"{i}. ID: {client.get('client_id', 'N/A'):15s} Name: {client.get('name', 'N/A')}")
    
    print("\n" + "="*80)
    print("INVOICES SHEET")
    print("="*80)
    invoices = sheets.get_all_rows("Invoices")
    for i, inv in enumerate(invoices[:10], 1):  # Show first 10
        invoice_id = inv.get('invoice_id', 'N/A')
        client_id = inv.get('client_id', 'N/A')
        client_name = inv.get('client_name', 'N/A')
        grand_total = inv.get('grand_total', '0')
        print(f"{i}. Invoice: {invoice_id:15s} ClientID: {client_id:15s} Name: {client_name:30s} Total: ₹{grand_total}")
    
    print("\n" + "="*80)
    print("MATCHING TEST")
    print("="*80)
    
    # Create mapping
    client_map = {c.get('name', '').lower().strip(): c.get('client_id') for c in clients if c.get('name')}
    
    for inv in invoices[:5]:
        inv_name = inv.get('client_name', '').strip()
        inv_client_id = inv.get('client_id', '')
        matched_id = client_map.get(inv_name.lower())
        
        match_status = "✅ MATCH" if matched_id == inv_client_id else f"❌ MISMATCH (should be {matched_id})"
        print(f"Invoice: {inv.get('invoice_id'):15s} | Name: '{inv_name:25s}' | Current ID: {inv_client_id:10s} | {match_status}")

if __name__ == "__main__":
    debug_mapping()
