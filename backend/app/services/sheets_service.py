"""
Google Sheets Service for N Company CRM.
Handles all interactions with Google Sheets API.
"""

from typing import List, Dict, Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import logging

logger = logging.getLogger(__name__)


class SheetsService:
    """Service for interacting with Google Sheets."""
    
    def __init__(self, credentials_path: str, spreadsheet_id: str):
        """
        Initialize Google Sheets service.
        
        Args:
            credentials_path: Path to service account JSON credentials
            spreadsheet_id: Google Spreadsheet ID
        """
        self.spreadsheet_id = spreadsheet_id
        
        try:
            # Setup credentials
            credentials = service_account.Credentials.from_service_account_file(
                credentials_path,
                scopes=['https://www.googleapis.com/auth/spreadsheets']
            )
            
            # Build service with timeout
            import socket
            socket.setdefaulttimeout(30)  # 30 second timeout
            
            self.service = build('sheets', 'v4', credentials=credentials)
            logger.info("Google Sheets service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Google Sheets service: {e}")
            raise
    
    def get_all_rows(self, sheet_name: str) -> List[Dict]:
        """
        Get all rows from a sheet.
        
        Args:
            sheet_name: Name of the sheet
            
        Returns:
            List of dictionaries representing rows
        """
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A:Z"
            ).execute()
            
            values = result.get('values', [])
            
            if not values:
                return []
            
            # First row is headers
            headers = values[0]
            rows = []
            
            for row_data in values[1:]:
                # Pad row data if shorter than headers
                padded_row = row_data + [''] * (len(headers) - len(row_data))
                row_dict = dict(zip(headers, padded_row))
                rows.append(row_dict)
            
            logger.info(f"Retrieved {len(rows)} rows from {sheet_name}")
            return rows
            
        except HttpError as e:
            logger.error(f"Error reading from {sheet_name}: {e}")
            raise
    
    def append_row(self, sheet_name: str, data: Dict) -> bool:
        """
        Append a row to a sheet.
        
        Args:
            sheet_name: Name of the sheet
            data: Dictionary of column:value pairs
            
        Returns:
            True if successful
        """
        try:
            # Get headers to ensure correct column order
            logger.info(f"Fetching headers from {sheet_name}")
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A1:Z1"
            ).execute()
            
            headers = result.get('values', [[]])[0]
            logger.info(f"Headers found: {headers}")
            
            if not headers:
                logger.error(f"Sheet {sheet_name} has no headers")
                return False
            
            # Build row in correct order
            row_values = [data.get(header, '') for header in headers]
            logger.info(f"Row values to append: {row_values}")
            
            # Append row
            body = {
                'values': [row_values]
            }
            
            result = self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A:Z",
                valueInputOption='RAW',
                body=body
            ).execute()
            
            logger.info(f"Appended row to {sheet_name}, result: {result.get('updates', {})}")
            return True
            
        except HttpError as e:
            logger.error(f"Error appending to {sheet_name}: {e}")
            raise
    
    def find_row(self, sheet_name: str, key: str, value: str) -> Optional[Dict]:
        """
        Find a row by key-value pair.
        
        Args:
            sheet_name: Name of the sheet
            key: Column name to search
            value: Value to find
            
        Returns:
            Row dictionary if found, None otherwise
        """
        rows = self.get_all_rows(sheet_name)
        
        for row in rows:
            if row.get(key) == value:
                return row
        
        return None
    
    def update_row(self, sheet_name: str, key: str, value: str, data: Dict) -> bool:
        """
        Update a row matching key-value pair.
        
        Args:
            sheet_name: Name of the sheet
            key: Column name to match
            value: Value to match
            data: Dictionary of updated values
            
        Returns:
            True if successful
        """
        try:
            # Get all data
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A:Z"
            ).execute()
            
            values = result.get('values', [])
            
            if not values:
                return False
            
            headers = values[0]
            key_index = headers.index(key) if key in headers else -1
            
            if key_index == -1:
                logger.error(f"Key '{key}' not found in headers")
                return False
            
            # Find row index
            row_index = None
            for i, row_data in enumerate(values[1:], start=2):  # Start at 2 (1-indexed + skip header)
                if len(row_data) > key_index and row_data[key_index] == value:
                    row_index = i
                    break
            
            if row_index is None:
                logger.warning(f"No row found with {key}={value}")
                return False
            
            # Build updated row
            current_row = values[row_index - 1]
            updated_row = current_row.copy()
            
            for header, new_value in data.items():
                if header in headers:
                    col_index = headers.index(header)
                    if col_index < len(updated_row):
                        updated_row[col_index] = new_value
                    else:
                        # Extend row if needed
                        updated_row.extend([''] * (col_index - len(updated_row) + 1))
                        updated_row[col_index] = new_value
            
            # Update the row
            body = {
                'values': [updated_row]
            }
            
            self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A{row_index}:Z{row_index}",
                valueInputOption='RAW',
                body=body
            ).execute()
            
            logger.info(f"Updated row {row_index} in {sheet_name}")
            return True
            
        except HttpError as e:
            logger.error(f"Error updating {sheet_name}: {e}")
            raise
