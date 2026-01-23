# 🧪 Invoice Generator - Complete Feature Testing Guide

## Test All 4 Enhanced Features

### Prerequisites
✅ Frontend running: http://localhost:3000  
✅ Backend running: http://localhost:8000  
✅ Google Sheets connected

---

## TEST 1: Manual Invoice ID with Custom Format ✓

### What to Test:
- Custom invoice ID format (Client Initials + Work Type + Price)
- Real-time uniqueness validation
- Error message for duplicate IDs

### Steps:
1. Navigate to: **http://localhost:3000/invoice**
2. Look for the **Invoice ID** field
3. Notice the blue helper box showing:
   ```
   Format: [Client Initials (2)] + [Work Type (2)] + [Price (4 digits)]
   Example: AC + WB + 5000 = ACWB5000 (Acme Corp, Web Dev, ₹50,000)
   ```
4. Type: `ACWB5000`
5. Wait 1 second - watch for uniqueness check
6. **Expected**: No error (this is a new ID)
7. Try typing: `INV-2026-001` (the one we created earlier)
8. **Expected**: Red error message "⚠️ This Invoice ID already exists in the database"

### ✅ Success Criteria:
- [ ] Helper text visible
- [ ] Can type custom format ID
- [ ] Uniqueness validation works
- [ ] Duplicate ID shows error

---

## TEST 2: Client Name - Manual + Dropdown Combo ✓

### What to Test:
- Can type NEW client names manually
- Can select EXISTING clients from dropdown
- New names get saved for future use

### Steps:
1. Click on **Client Name** field
2. Type: `XYZ Technologies` (a brand new client)
3. **Expected**: Text appears, no error
4. Clear the field
5. Type: `Acme` and wait
6. **Expected**: Dropdown shows "Acme Corporation"
7. Select it from dropdown
8. **Expected**: Field shows "Acme Corporation"

### ✅ Success Criteria:
- [ ] Can type ANY client name
- [ ] Dropdown shows existing clients
- [ ] Can select from dropdown
- [ ] No errors for new names

---

## TEST 3: Sales Person - Manual + Dropdown Combo ✓

### What to Test:
- Can type NEW salesperson names
- Can select EXISTING salespeople
- New names get saved

### Steps:
1. Click on **Sales Person** field
2. Type: `Jennifer Smith` (new salesperson)
3. **Expected**: Text appears, no error
4. Clear the field
5. Type: `Rajesh` and wait
6. **Expected**: Dropdown shows "Rajesh Kumar"
7. Select "Rajesh Kumar"
8. **Expected**: Field shows "Rajesh Kumar"

### ✅ Success Criteria:
- [ ] Can type ANY salesperson name
- [ ] Dropdown shows existing people
- [ ] Can select from dropdown
- [ ] No errors for new names

---

## TEST 4: Add New Client Button & Modal ✓

### What to Test:
- Modal opens when clicked
- Can fill client data
- Saves and closes properly
- Client name appears in form

### Steps:
1. Click **"Add New Client"** button (green button)
2. **Expected**: Modal popup appears with form
3. Fill in the form:
   ```
   Client Name:     Future Tech Solutions
   Contact Person:  Sarah Mitchell
   Email:          sarah@futuretech.com
   Phone:          +91-9876543210
   Industry:       Artificial Intelligence
   Address:        Innovation Park, Bangalore, Karnataka
   ```
4. Take a screenshot of filled modal
5. Click **"Save Client"** button
6. **Expected**: 
   - Modal closes
   - "Future Tech Solutions" appears in Client Name field
   - No errors

### ✅ Success Criteria:
- [ ] Modal opens on button click
- [ ] All fields work properly
- [ ] Save button works
- [ ] Client name auto-fills in form
- [ ] Modal closes after save

---

## TEST 5: Complete Invoice Creation with New Data 🚀

### What to Test:
- Create invoice with custom ID format
- Use manually entered client
- Use manually entered salesperson
- Verify saves to Google Sheets

### Steps:
1. **Invoice ID**: `FTAI8500`
   - FT = Future Tech
   - AI = Artificial Intelligence
   - 8500 = ₹85,000

2. **Client Name**: `Future Tech Solutions` (should already be filled)

3. **Invoice Date**: `2026-01-23`

4. **Due Date**: `2026-02-23`

5. **Sales Person**: `Jennifer Smith` (type manually)

6. **Line Item**:
   ```
   Service:      AI Consulting Services
   Description:  Machine learning model development
   Quantity:     1
   Unit Price:   85000
   Tax:          18
   Discount:     0
   ```

7. **Verify Calculations**:
   - Subtotal: ₹85,000
   - Tax (18%): ₹15,300
   - Discount: ₹0
   - **Grand Total**: ₹100,300

8. Click **"Generate Invoice"** button

9. **Expected Success Message**:
   ```
   ✓ Invoice FTAI8500 created successfully! Total: ₹100300
   ```

10. **Verify in Google Sheets**:
    - Open: https://docs.google.com/spreadsheets/d/1n-4I2tGxNx4kE__Y8nHDxbMjb_ChrClkw40vln-PB04
    - Check **Invoices** sheet - New row with:
      - invoice_id: FTAI8500
      - client_name: Future Tech Solutions
      - sales_person: Jennifer Smith
      - grand_total: 100300
    - Check **Invoice_Items** sheet - Line item added

### ✅ Success Criteria:
- [ ] Custom Invoice ID accepted
- [ ] Manual client name works
- [ ] Manual salesperson name works
- [ ] Calculations correct
- [ ] Success message appears
- [ ] Data appears in Google Sheets
- [ ] Form clears after 3 seconds

---

## TEST 6: Verify Data Persistence 💾

### What to Test:
- New client name saved
- New salesperson saved
- Can reuse them in future invoices

### Steps:
1. After form clears (wait 3 seconds)
2. Click **Client Name** field
3. Start typing: `Future`
4. **Expected**: "Future Tech Solutions" appears in dropdown
5. Click **Sales Person** field
6. Start typing: `Jennifer`
7. **Expected**: "Jennifer Smith" appears in dropdown

### ✅ Success Criteria:
- [ ] "Future Tech Solutions" in client dropdown
- [ ] "Jennifer Smith" in salesperson dropdown
- [ ] Can select both for new invoice
- [ ] Data persisted in frontend state

---

## 📊 Final Checklist

### All 4 Features Working:
- [ ] ✅ Manual Invoice ID with custom format (ACWB5000)
- [ ] ✅ Uniqueness validation (shows error for duplicates)
- [ ] ✅ Client combo input (manual + dropdown)
- [ ] ✅ Salesperson combo input (manual + dropdown)
- [ ] ✅ Add New Client modal (fully functional)
- [ ] ✅ Data saves to Google Sheets
- [ ] ✅ New names persist for re-use

### Database Verification:
- [ ] ✅ Invoice data in "Invoices" sheet
- [ ] ✅ Line items in "Invoice_Items" sheet
- [ ] ✅ All fields populated correctly
- [ ] ✅ Custom invoice ID saved
- [ ] ✅ Manual client/salesperson names saved

---

## 🎯 Expected Final Result

After completing all tests, you should have:

1. **Created Invoice**: FTAI8500
2. **New Client**: Future Tech Solutions
3. **New Salesperson**: Jennifer Smith
4. **Total Amount**: ₹100,300
5. **All data** visible in Google Sheets
6. **Reusable names** in dropdowns

---

## 🐛 Common Issues & Solutions

### Issue: "Connection refused" on localhost:3000
**Solution**: Run `npm run dev` in frontend directory

### Issue: API errors
**Solution**: Ensure backend running on port 8000

### Issue: Uniqueness check doesn't work
**Solution**: Wait 1-2 seconds after typing invoice ID

### Issue: Modal doesn't open
**Solution**: Check browser console (F12) for errors

---

## ✅ Testing Complete!

Once all checkboxes are marked, report:
1. Which features worked perfectly
2. Any issues encountered
3. Screenshots of success messages
4. Confirmation of Google Sheets data

**Happy Testing!** 🚀
