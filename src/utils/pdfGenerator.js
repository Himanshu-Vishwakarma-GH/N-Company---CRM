/**
 * PDF Invoice Generator Utility
 * Generates professional PDF invoices using jsPDF
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate and download a professional PDF invoice
 * @param {Object} invoiceData - Invoice data object
 */
export const generateInvoicePDF = (invoiceData) => {
    // Create new PDF document
    const doc = new jsPDF();

    // Company Details
    const companyName = "N Company";
    const companyAddress = "123 Business Avenue, Tech Park\nNew Delhi, India - 110001";
    const companyPhone = "+91-11-1234-5678";
    const companyEmail = "info@ncompany.com";
    const companyGST = "GST: 07AAAAA0000A1Z5";

    // Colors
    const primaryColor = [99, 102, 241]; // Indigo
    const darkColor = [31, 41, 55];
    const lightGray = [156, 163, 175];

    // Add Company Header with background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 45, 'F');

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 15, 20);

    // Company Details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(companyAddress, 15, 28);
    doc.text(`Phone: ${companyPhone} | Email: ${companyEmail}`, 15, 37);
    doc.text(companyGST, 15, 42);

    // Invoice Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 150, 25);

    // Reset text color
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

    // Invoice Details Box
    const invoiceDetailsY = 55;

    // Left side - Client Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 15, invoiceDetailsY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoiceData.clientName || 'Client Name', 15, invoiceDetailsY + 7);

    // Right side - Invoice Info
    const rightX = 120;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);

    doc.text('Invoice ID:', rightX, invoiceDetailsY);
    doc.text('Invoice Date:', rightX, invoiceDetailsY + 7);
    doc.text('Due Date:', rightX, invoiceDetailsY + 14);
    doc.text('Sales Person:', rightX, invoiceDetailsY + 21);

    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.invoiceId || 'N/A', rightX + 30, invoiceDetailsY);
    doc.text(invoiceData.invoiceDate || 'N/A', rightX + 30, invoiceDetailsY + 7);
    doc.text(invoiceData.dueDate || 'N/A', rightX + 30, invoiceDetailsY + 14);
    doc.text(invoiceData.salesPerson || 'N/A', rightX + 30, invoiceDetailsY + 21);

    // Line Items Table
    const tableStartY = invoiceDetailsY + 30;

    // Prepare table data
    const tableData = invoiceData.items.map(item => [
        item.service,
        item.description,
        item.quantity.toString(),
        `₹${item.unitPrice.toLocaleString('en-IN')}`,
        `${item.tax}%`,
        `${item.discount}%`,
        `₹${calculateLineTotal(item).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ]);

    // Add table
    doc.autoTable({
        startY: tableStartY,
        head: [['Service/Product', 'Description', 'Qty', 'Unit Price', 'Tax', 'Discount', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: darkColor
        },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 50 },
            2: { halign: 'center', cellWidth: 15 },
            3: { halign: 'right', cellWidth: 25 },
            4: { halign: 'center', cellWidth: 15 },
            5: { halign: 'center', cellWidth: 18 },
            6: { halign: 'right', cellWidth: 27, fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 }
    });

    // Calculate totals
    const totals = calculateTotals(invoiceData.items);
    const finalY = doc.lastAutoTable.finalY + 10;

    // Totals Box
    const totalsX = 120;
    doc.setFillColor(245, 247, 250);
    doc.rect(totalsX - 5, finalY - 5, 75, 45, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Subtotal
    doc.text('Subtotal:', totalsX, finalY);
    doc.text(`₹${totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 185, finalY, { align: 'right' });

    // Tax
    doc.text('Total Tax:', totalsX, finalY + 7);
    doc.text(`₹${totals.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 185, finalY + 7, { align: 'right' });

    // Discount
    doc.setTextColor(239, 68, 68); // Red for discount
    doc.text('Total Discount:', totalsX, finalY + 14);
    doc.text(`-₹${totals.totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 185, finalY + 14, { align: 'right' });

    // Grand Total
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);

    // Grand Total background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(totalsX - 5, finalY + 20, 75, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.text('GRAND TOTAL:', totalsX, finalY + 27);
    doc.text(`₹${totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 185, finalY + 27, { align: 'right' });

    // Footer
    const footerY = 270;
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    doc.text('Thank you for your business!', 105, footerY, { align: 'center' });
    doc.text('This is a computer-generated invoice and does not require a signature.', 105, footerY + 5, { align: 'center' });

    // Page border
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287);

    // Generate filename
    const filename = `Invoice_${invoiceData.invoiceId || 'DRAFT'}_${invoiceData.clientName?.replace(/\s+/g, '_') || 'Client'}.pdf`;

    // Save/download PDF
    doc.save(filename);

    return filename;
};

/**
 * Calculate line total for an invoice item
 */
const calculateLineTotal = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = (subtotal * item.tax) / 100;
    const discountAmount = (subtotal * item.discount) / 100;
    return subtotal + taxAmount - discountAmount;
};

/**
 * Calculate invoice totals
 */
const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalTax = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.tax) / 100), 0);
    const totalDiscount = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.discount) / 100), 0);
    const grandTotal = subtotal + totalTax - totalDiscount;

    return { subtotal, totalTax, totalDiscount, grandTotal };
};
