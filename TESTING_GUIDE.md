# Testing Guide - Frontend to Backend Integration

## ✅ System Status Check

### Backend (FastAPI) - ✓ Running
- URL: http://localhost:8000
- Status: RUNNING
- Last successful invoice: INV-2026-001 created successfully!

### Frontend (React) - Check if running
- URL: http://localhost:3000
- Should be running from: `npm run dev`

---

## 🧪 Manual Test Instructions

### Step 1: Open Frontend
1. Open Chrome browser
2. Navigate to: **http://localhost:3000/invoice**
3. You should see the "Create New Invoice" page

### Step 2: Fill Invoice Form

**Invoice Details:**
- **Client**: Select "Acme Corporation" from dropdown
- **Invoice Date**: Select today's date
- **Due Date**: Select a date 30 days from now
- **Sales Person**: Should default to "Rajesh Kumar"

**Line Items:**
- **Service/Product**: "Premium Consulting"
- **Description**: "Strategic business consulting"
- **Quantity**: 5
- **Unit Price**: 25000
- **Tax %**: 18 (default)
- **Discount %**: 5

### Step 3: Verify Calculations

You should see automatic calculations:
- **Subtotal**: ₹125,000 (5 × 25,000)
- **Total Tax**: ₹22,500 (18% of subtotal)
- **Total Discount**: ₹6,250 (5% of subtotal)
- **Grand Total**: ₹141,250

### Step 4: Create Invoice

1. Click the **"Generate Invoice"** button
2. Watch for the **green success message** at the top
3. The message should say: "Invoice INV-2026-XXX created successfully! ₹141250"

### Step 5: Verify in Google Sheets

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1n-4I2tGxNx4kE__Y8nHDxbMjb_ChrClkw40vln-PB04
2. Check the **Invoices** sheet - you should see a new row with:
   - Invoice ID: INV-2026-XXX (auto-generated)
   - Client: Acme Corporation
   - Grand Total: 141250
   - Status: draft
3. Check the **Invoice_Items** sheet - you should see the line item details

---

## 🎯 Expected Results

✅ Form fills correctly  
✅ Calculations happen in real-time  
✅ Success message appears instantly  
✅ Invoice ID is generated (INV-2026-XXX)  
✅ Data appears in Google Sheets within 1 second  
✅ Form clears after 3 seconds  

---

## 🐛 Troubleshooting

### If you see "Failed to create invoice" error:

**Check:**
1. Backend is running: http://localhost:8000 should show API info
2. Frontend can reach backend (check browser console for CORS errors)
3. Google Sheets has correct sheet names (Invoices, Invoice_Items, Clients)

### If calculations don't update:

- Try changing the quantity or unit price
- Calculations should update instantly

### If success message doesn't appear:

- Check browser console (F12) for errors
- Verify backend logs show the POST request

---

## 📊 Backend Logs Show Success

From the backend terminal, we can see:
```
INFO - Retrieved 1 rows from Clients
INFO - Appended row to Invoices
INFO - Appended row to Invoice_Items
INFO - Created invoice INV-2026-001 for client CLT001
POST /api/v1/invoices HTTP/1.1" 201 Created
```

This confirms:
- ✅ Backend can read from Google Sheets (found client)
- ✅ Backend can write to Google Sheets (saved invoice)
- ✅ API returns 201 Created (success!)

---

## 🚀 Test Now!

Follow the steps above and verify:
1. Frontend form works smoothly
2. Invoice creates successfully  
3. Data appears in Google Sheets

**Happy Testing!** 🎉
