# Google Sheets API Setup Guide

## Overview

This guide will help you set up Google Sheets API with Service Account authentication for the N Company CRM backend.

## Why Service Account?

We use a **Service Account** (not a simple API key) because:
- It allows server-to-server communication without user interaction
- It can access sheets 24/7 without OAuth prompts
- It's the proper way for backend services to access Google Sheets

---

## Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it: `N-Company-CRM`
4. Click **Create**

### Step 2: Enable Google Sheets API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and click **Enable**

### Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in details:
   - **Service account name**: `crm-backend-service`
   - **Service account ID**: (auto-filled)
   - **Description**: `Backend service for CRM Google Sheets access`
4. Click **Create and Continue**
5. **Grant this service account access to project**: Skip (click Continue)
6. **Grant users access to this service account**: Skip (click Done)

### Step 4: Create Service Account Key

1. In the **Credentials** page, find your service account in the list
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Choose **JSON** format
6. Click **Create**
7. **The JSON file will download automatically** - this is your credentials file!

### Step 5: Move Credentials File

1. Create a `credentials` folder in your backend directory:
   ```bash
   cd backend
   mkdir credentials
   ```

2. Move the downloaded JSON file to `backend/credentials/`
3. Rename it to `service-account.json`

Your file structure should look like:
```
backend/
├── credentials/
│   └── service-account.json  ← Your credentials file
├── app/
├── requirements.txt
└── .env.example
```

### Step 6: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new blank spreadsheet
3. Name it: `N Company CRM Database`
4. **Copy the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit
                                            ^^^^^^^^^^^^^^^^^^^
   ```

### Step 7: Create Required Sheets

Create **3 sheets** (tabs) in your spreadsheet with these exact names and headers:

#### Sheet 1: **Invoices**
Create these column headers in Row 1:
```
invoice_id | client_id | client_name | invoice_date | due_date | subtotal | total_tax | total_discount | grand_total | status | sales_person | created_by | created_at | updated_at
```

#### Sheet 2: **Invoice_Items**
Create these column headers in Row 1:
```
item_id | invoice_id | service | description | quantity | unit_price | tax_percent | discount_percent | line_total
```

#### Sheet 3: **Clients**
Create these column headers in Row 1:
```
client_id | name | contact | email | phone | industry | stage | joined_date | billing_address | shipping_address | created_at
```

### Step 8: Share Spreadsheet with Service Account

**CRITICAL STEP** - Without this, your backend cannot access the spreadsheet!

1. Open the `service-account.json` file
2. Find the `client_email` field (looks like: `crm-backend-service@project-name.iam.gserviceaccount.com`)
3. Copy this email address
4. In your Google Spreadsheet, click **Share**
5. Paste the service account email
6. Set permission to **Editor**
7. **Uncheck** "Notify people" (it's a service account, not a real person)
8. Click **Share**

### Step 9: Configure Backend Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` file:
   ```bash
   # Google Sheets Configuration
   GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/service-account.json
   SPREADSHEET_ID=your_spreadsheet_id_from_step_6_here
   
   # API Configuration
   API_KEY=dev-api-key-12345
   ENVIRONMENT=development
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   
   # Server Configuration
   HOST=0.0.0.0
   PORT=8000
   ```

3. Replace `SPREADSHEET_ID` with your actual ID from Step 6

### Step 10: Add Sample Client Data

To test the system, add a sample client to the **Clients** sheet:

| client_id | name | contact | email | phone | industry | stage | joined_date | billing_address | shipping_address | created_at |
|-----------|------|---------|-------|-------|----------|-------|-------------|-----------------|------------------|------------|
| CLT001 | Acme Corporation | Robert Taylor | robert@acme.com | +91-9876543210 | Technology | repeat | 2024-08-15 | 123 Tech Park, Noida | 123 Tech Park, Noida | 2024-08-15T10:00:00 |

---

## Testing the Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Backend

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 3. Test API with Swagger UI

1. Open browser: `http://localhost:8000/docs`
2. You should see Swagger UI with API documentation
3. Click **Authorize** button
4. Enter API Key: `dev-api-key-12345`
5. Click **Authorize**

### 4. Create Your First Invoice

In Swagger UI:
1. Expand `POST /api/v1/invoices`
2. Click **Try it out**
3. Use this test data:
   ```json
   {
     "client_id": "CLT001",
     "invoice_date": "2026-01-23",
     "due_date": "2026-02-23",
     "sales_person": "Rajesh Kumar",
     "items": [
       {
         "service": "Enterprise License",
         "description": "Annual subscription",
         "quantity": 10,
         "unit_price": 50000,
         "tax_percent": 18,
         "discount_percent": 10
       }
     ]
   }
   ```
4. Click **Execute**
5. Check Response - should be `201 Created` with invoice details
6. **Check your Google Sheet** - you should see the invoice data!

---

## Troubleshooting

### Error: "Failed to initialize Google Sheets service"
- Check that `service-account.json` exists in `backend/credentials/`
- Verify the path in `.env` is correct

### Error: "The caller does not have permission"
- Make sure you shared the spreadsheet with the service account email
- The service account email is in `service-account.json` as `client_email`

### Error: "Spreadsheet not found"
- Verify the `SPREADSHEET_ID` in `.env` matches your Google Sheet URL
- Make sure the spreadsheet exists and is accessible

### Error: "Sheet has no headers"
- Make sure each sheet has the exact column headers as specified
- Headers must be in Row 1

### API Key Error
- Make sure you clicked **Authorize** in Swagger UI
- Use `dev-api-key-12345` as the API key
- Include `X-API-Key` header in direct API calls

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `service-account.json` to Git (it's in `.gitignore`)
- Never commit `.env` file to Git (it's in `.gitignore`)
- Keep your service account credentials secure
- In production, use environment variables instead of `.env` file

---

## Next Steps

Once your backend is running successfully:
1. ✅ Connect frontend to backend
2. ✅ Test invoice creation from React app
3. ✅ Build Client endpoints
4. ✅ Add dashboard aggregation APIs
5. ✅ Migrate to PostgreSQL (Phase 2)

---

## Quick Reference

**Backend Server**: `http://localhost:8000`
**API Docs**: `http://localhost:8000/docs`
**API Base**: `http://localhost:8000/api/v1`

**Service Account Email**: Check `credentials/service-account.json` → `client_email`
**Spreadsheet URL**: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID`

---

Need help? Check the backend logs for detailed error messages!
