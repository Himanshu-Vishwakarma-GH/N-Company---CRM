# Activity Logs - Google Sheets Setup Guide

## Step 1: Create Activity_Logs Sheet

1. Open your Google Spreadsheet
2. Create a new sheet named exactly: **Activity_Logs**
3. Add the following headers in Row 1:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| log_id | type | title | description | entity_id | entity_type | user | timestamp | status |

## Header Descriptions

- **log_id**: Unique log ID (LOG...)
- **type**: Event type (client_created, invoice_generated, ticket_created)
- **title**: Short summary
- **description**: Detailed activity info
- **entity_id**: Related ID (CLT001, INV001, etc.)
- **entity_type**: client, invoice, ticket, system
- **user**: User name (Admin, etc.)
- **timestamp**: ISO timestamp (2026-02-04T...)
- **status**: unread, read

## Sample Data (Optional)

You can add sample logs for testing:

| log_id | type | title | description | entity_id | entity_type | user | timestamp | status |
|--------|------|-------|-------------|-----------|-------------|------|-----------|--------|
| LOG001 | client_created | New Client Added | Added client John Doe | CLT001 | client | Admin | 2026-02-04T10:00:00 | read |
| LOG002 | invoice_generated | Invoice Generated | Generated invoice #INV101 | INV101 | invoice | Admin | 2026-02-04T10:30:00 | unread |
| LOG003 | ticket_created | New Ticket | Ticket created: Login Issue | TKT001 | ticket | Client | 2026-02-04T11:00:00 | unread |

## Next Steps

1. Create the sheet
2. Restart backend
3. Backend will automatically start logging activities when you create clients/invoices/tickets!
