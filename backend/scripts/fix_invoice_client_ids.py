"""
Migration script to fix mismatched client_ids in Invoices sheet.

This script:
1. Reads all clients from the Clients sheet
2. Reads all invoices from the Invoices sheet
3. Matches invoices to clients by client_name
4. Updates the client_id in each invoice to match the correct client
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.sheets_service import SheetsService
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def fix_invoice_client_ids():
    """Fix all invoice client_ids to match their corresponding clients."""
    
    # Initialize sheets service
    sheets_service = SheetsService(
        credentials_path=settings.google_sheets_credentials_path,
        spreadsheet_id=settings.spreadsheet_id
    )
    
    logger.info("=" * 60)
    logger.info("FIXING INVOICE CLIENT IDS")
    logger.info("=" * 60)
    
    # Step 1: Get all clients
    logger.info("\n📋 Fetching all clients...")
    clients = sheets_service.get_all_rows("Clients")
    logger.info(f"✓ Found {len(clients)} clients")
    
    # Create a mapping of client_name (lowercase) -> client_id
    client_name_to_id = {}
    for client in clients:
        if client.get('name') and client.get('client_id'):
            name_lower = client['name'].lower().strip()
            client_name_to_id[name_lower] = client['client_id']
    
    logger.info(f"✓ Created mapping for {len(client_name_to_id)} clients")
    
    # Step 2: Get all invoices
    logger.info("\n📋 Fetching all invoices...")
    invoices = sheets_service.get_all_rows("Invoices")
    logger.info(f"✓ Found {len(invoices)} invoices")
    
    # Step 3: Fix each invoice
    logger.info("\n🔧 Fixing invoice client_ids...")
    fixed_count = 0
    skipped_count = 0
    error_count = 0
    
    for i, invoice in enumerate(invoices):
        invoice_id = invoice.get('invoice_id', 'Unknown')
        client_name = invoice.get('client_name', '').strip()
        current_client_id = invoice.get('client_id', '')
        
        if not client_name:
            logger.warning(f"  ⚠️  Invoice {invoice_id}: No client_name, skipping")
            skipped_count += 1
            continue
        
        # Find correct client_id
        name_lower = client_name.lower()
        correct_client_id = client_name_to_id.get(name_lower)
        
        if not correct_client_id:
            logger.warning(f"  ⚠️  Invoice {invoice_id}: No matching client for '{client_name}', skipping")
            skipped_count += 1
            continue
        
        # Check if it needs fixing
        if current_client_id == correct_client_id:
            logger.info(f"  ✓ Invoice {invoice_id}: Already correct ({correct_client_id})")
            continue
        
        # Update the invoice
        try:
            success = sheets_service.update_row(
                sheet_name="Invoices",
                key="invoice_id",
                value=invoice_id,
                data={"client_id": correct_client_id}
            )
            
            if success:
                logger.info(f"  ✅ Invoice {invoice_id}: Fixed {current_client_id} → {correct_client_id} (Client: {client_name})")
                fixed_count += 1
            else:
                logger.error(f"  ❌ Invoice {invoice_id}: Update failed")
                error_count += 1
                
        except Exception as e:
            logger.error(f"  ❌ Invoice {invoice_id}: Error - {str(e)}")
            error_count += 1
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("SUMMARY")
    logger.info("=" * 60)
    logger.info(f"Total Invoices: {len(invoices)}")
    logger.info(f"✅ Fixed: {fixed_count}")
    logger.info(f"⚠️  Skipped: {skipped_count}")
    logger.info(f"❌ Errors: {error_count}")
    logger.info(f"✓ Already Correct: {len(invoices) - fixed_count - skipped_count - error_count}")
    logger.info("=" * 60)


if __name__ == "__main__":
    try:
        fix_invoice_client_ids()
        print("\n✅ Migration completed successfully!")
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
