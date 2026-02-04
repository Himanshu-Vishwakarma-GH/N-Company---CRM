# Support Dashboard - Google Sheets Setup Guide

## Step 1: Create Support_Tickets Sheet

1. Open your Google Spreadsheet
2. Create a new sheet named exactly: **Support_Tickets**
3. Add the following headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ticket_id | title | description | client_id | client_name | status | priority | assigned_to | category | created_date | updated_date | resolved_date |

## Header Descriptions

- **ticket_id**: Unique ticket identifier (TKT001, TKT002, etc.)
- **title**: Ticket subject/title
- **description**: Detailed description of the issue
- **client_id**: Reference to client (CLT001, CLT002, etc.)
- **client_name**: Client name for display
- **status**: open, in_progress, resolved, closed
- **priority**: low, medium, high, critical
- **assigned_to**: Support agent name (can be empty)
- **category**: technical, billing, general, feature_request
- **created_date**: Date created (YYYY-MM-DD)
- **updated_date**: Last update date (YYYY-MM-DD)
- **resolved_date**: Date resolved (empty if not resolved)

## Sample Data (Optional)

You can add sample tickets for testing:

| ticket_id | title | description | client_id | client_name | status | priority | assigned_to | category | created_date | updated_date | resolved_date |
|-----------|-------|-------------|-----------|-------------|--------|----------|-------------|----------|--------------|--------------|---------------|
| TKT001 | Login Issue | Cannot access dashboardafter password reset | CLT020 | Himanshu Skilled | open | high | Rajesh Kumar | technical | 2026-02-04 | 2026-02-04 | |
| TKT002 | Billing Question | Need clarification on last invoice | CLT021 | nj | resolved | medium | Priya Sharma | billing | 2026-02-03 | 2026-02-04 | 2026-02-04 |
| TKT003 | Feature Request | Add export to PDF feature | CLT022 | Client Test | in_progress | low | Amit Patel | feature_request | 2026-02-02 | 2026-02-04 | |

## Step 2: Verify Setup

Once the sheet is created, the backend will automatically connect to it when you:
1. Create a ticket via API
2. List tickets via API
3. Update ticket status

## Backend Restart

After creating the sheet, restart your backend server:
```bash
# The server will auto-reload if using --reload flag
# Otherwise, stop and start again
```

## Testing the API

Test the ticket endpoints:

**List tickets:**
```bash
curl -H "X-API-Key: dev-api-key-12345" http://localhost:8000/api/v1/tickets
```

**Create ticket:**
```bash
curl -X POST http://localhost:8000/api/v1/tickets \
  -H "X-API-Key: dev-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ticket",
    "description": "This is a test ticket",
    "client_id": "CLT023",
    "client_name": "N Company",
    "priority": "medium",
    "category": "general"
  }'
```

**Update status:**
```bash
curl -X PATCH "http://localhost:8000/api/v1/tickets/TKT001/status?status=resolved" \
  -H "X-API-Key: dev-api-key-12345"
```

## Next Steps

After setting up the Google Sheet:
1. ✅ Backend is ready (schemas, service, router created)
2. ⏭️ Update frontend Support Dashboard to use real data
3. ⏭️ Add ticket creation UI
4. ⏭️ Add ticket management features
