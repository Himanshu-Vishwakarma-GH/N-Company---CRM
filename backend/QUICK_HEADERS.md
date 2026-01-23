# Quick Setup - Column Headers for Google Sheets

## Copy these headers into your sheets:

### Sheet 1: Invoices (Row 1)
Copy this entire line and paste it into Row 1 of your "Invoices" sheet:
```
invoice_id	client_id	client_name	invoice_date	due_date	subtotal	total_tax	total_discount	grand_total	status	sales_person	created_by	created_at	updated_at
```

### Sheet 2: Invoice_Items (Row 1)
Copy this entire line and paste it into Row 1 of your "Invoice_Items" sheet:
```
item_id	invoice_id	service	description	quantity	unit_price	tax_percent	discount_percent	line_total
```

### Sheet 3: Clients (Row 1)
Copy this entire line and paste it into Row 1 of your "Clients" sheet:
```
client_id	name	contact	email	phone	industry	stage	joined_date	billing_address	shipping_address	created_at
```

---

## Quick Instructions:

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1n-4I2tGxNx4kE__Y8nHDxbMjb_ChrClkw40vln-PB04

2. For each sheet:
   - Click on cell A1
   - Copy the header line above (between the ``` marks)
   - Paste into cell A1
   - The tabs should separate the columns automatically

3. Once all 3 sheets have headers, you're ready to add sample data!

---

## After Adding Headers:

Run this command to add sample clients:
```bash
cd backend
python add_sample_data.py
```

Then start the backend:
```bash
uvicorn app.main:app --reload
```

Your backend will be at: http://localhost:8000
API docs at: http://localhost:8000/docs
