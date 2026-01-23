# N Company CRM - FastAPI Backend

## Overview

Production-ready FastAPI backend for N Company CRM with Google Sheets integration.

**Architecture**: Clean separation of concerns (Routers → Services → Data Layer)
**Database**: Google Sheets (Phase 1), PostgreSQL ready (Phase 2)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Google Sheets

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create service account credentials
5. Download JSON credentials as `credentials/service-account.json`
6. Create a Google Spreadsheet with 3 sheets: Invoices, Invoice_Items, Clients
7. Share the spreadsheet with the service account email (found in credentials JSON)

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Google Sheets Spreadsheet ID
```

### 4. Run Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API

- **API Base URL**: `http://localhost:8000/api/v1`
- **Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Invoice APIs

- `POST /api/v1/invoices` - Create new invoice
- `GET /api/v1/invoices` - List all invoices
- `GET /api/v1/invoices/{invoice_id}` - Get specific invoice
- `PATCH /api/v1/invoices/{invoice_id}/status` - Update invoice status

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── core/
│   │   ├── config.py          # Configuration & environment
│   │   └── dependencies.py    # Dependency injection
│   ├── routers/
│   │   └── invoice.py         # Invoice endpoints
│   ├── services/
│   │   ├── sheets_service.py  # Google Sheets integration
│   │   └── invoice_service.py # Invoice business logic
│   ├── models/
│   │   └── invoice.py         # Data models
│   ├── schemas/
│   │   └── invoice.py         # Pydantic schemas
│   └── utils/
│       └── helpers.py         # Utility functions
├── requirements.txt
├── .env.example
└── README.md
```

## Google Sheets Structure

### Sheet 1: Invoices
Columns: invoice_id, client_id, client_name, invoice_date, due_date, subtotal, total_tax, total_discount, grand_total, status, sales_person, created_at

### Sheet 2: Invoice_Items
Columns: item_id, invoice_id, service, description, quantity, unit_price, tax_percent, discount_percent, line_total

### Sheet 3: Clients
Columns: client_id, name, contact, email, phone, industry, stage, joined_date, billing_address, shipping_address

## Authentication

Current: Simple API Key (`X-API-Key` header)
Future: JWT tokens with role-based access

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload

# Run on custom port
uvicorn app.main:app --port 8080
```

## Testing

Test endpoints using Swagger UI at `http://localhost:8000/docs`

## Next Steps

- [ ] Complete Invoice module
- [ ] Add Client endpoints
- [ ] Build dashboard aggregation APIs
- [ ] Implement analytics endpoints
- [ ] Migrate to PostgreSQL

## Architecture Benefits

✅ Clean separation of concerns
✅ Easy to test
✅ Scalable and maintainable
✅ Ready for PostgreSQL migration
✅ Production-ready error handling
