import { useState } from 'react';
import Button from '../components/Button';
import { Input, Select } from '../components/Input';
import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [lineItems, setLineItems] = useState([
        { id: 1, service: '', description: '', quantity: 1, unitPrice: 0, tax: 18, discount: 0 }
    ]);

    const clients = [
        { value: 'CLT001', label: 'Acme Corporation' },
        { value: 'CLT002', label: 'Tech Innovators Ltd' },
        { value: 'CLT003', label: 'Global Solutions Inc' },
    ];

    const addLineItem = () => {
        setLineItems([...lineItems, {
            id: Date.now(),
            service: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            tax: 18,
            discount: 0
        }]);
    };

    const removeLineItem = (id) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const updateLineItem = (id, field, value) => {
        setLineItems(lineItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateLineTotal = (item) => {
        const subtotal = item.quantity * item.unitPrice;
        const taxAmount = (subtotal * item.tax) / 100;
        const discountAmount = (subtotal * item.discount) / 100;
        return subtotal + taxAmount - discountAmount;
    };

    const calculateTotals = () => {
        const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const totalTax = lineItems.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.tax) / 100), 0);
        const totalDiscount = lineItems.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.discount) / 100), 0);
        const grandTotal = subtotal + totalTax - totalDiscount;

        return { subtotal, totalTax, totalDiscount, grandTotal };
    };

    const totals = calculateTotals();

    const handleGenerate = () => {
        alert('Invoice generated successfully!');
    };

    return (
        <div className="invoice-page">
            <div className="invoice-header">
                <div>
                    <h2>Create New Invoice</h2>
                    <p className="invoice-subtitle">Generate professional invoices for your clients</p>
                </div>
                <div className="invoice-actions-header">
                    <Button variant="ghost">Clear Form</Button>
                    <Button variant="outline">Save Draft</Button>
                </div>
            </div>

            <div className="invoice-container">
                <div className="invoice-form-section">
                    <h3 className="section-title">Invoice Details</h3>
                    <div className="form-grid">
                        <Input
                            label="Invoice Number"
                            placeholder="INV-2026-001"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            required
                        />
                        <Select
                            label="Client"
                            options={clients}
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            required
                        />
                        <Input
                            label="Invoice Date"
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            required
                        />
                        <div className="add-client-wrapper">
                            <label className="input-label">Quick Action</label>
                            <Button variant="secondary" size="sm" icon="➕">Add New Client</Button>
                        </div>
                    </div>
                </div>

                <div className="invoice-form-section">
                    <div className="section-header">
                        <h3 className="section-title">Line Items</h3>
                        <Button variant="primary" size="sm" icon="➕" onClick={addLineItem}>
                            Add Item
                        </Button>
                    </div>

                    <div className="line-items-table">
                        <div className="table-header">
                            <div className="col-service">Service/Product</div>
                            <div className="col-description">Description</div>
                            <div className="col-qty">Qty</div>
                            <div className="col-price">Unit Price</div>
                            <div className="col-tax">Tax %</div>
                            <div className="col-discount">Discount %</div>
                            <div className="col-total">Line Total</div>
                            <div className="col-action">Action</div>
                        </div>

                        {lineItems.map((item) => (
                            <div key={item.id} className="table-row">
                                <input
                                    className="table-input col-service"
                                    placeholder="Service name"
                                    value={item.service}
                                    onChange={(e) => updateLineItem(item.id, 'service', e.target.value)}
                                />
                                <input
                                    className="table-input col-description"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                />
                                <input
                                    className="table-input col-qty"
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                />
                                <input
                                    className="table-input col-price"
                                    type="number"
                                    min="0"
                                    placeholder="0.00"
                                    value={item.unitPrice}
                                    onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                />
                                <input
                                    className="table-input col-tax"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={item.tax}
                                    onChange={(e) => updateLineItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                                />
                                <input
                                    className="table-input col-discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={item.discount}
                                    onChange={(e) => updateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                />
                                <div className="col-total line-total">
                                    ₹{calculateLineTotal(item).toFixed(2)}
                                </div>
                                <div className="col-action">
                                    <button
                                        className="delete-btn"
                                        onClick={() => removeLineItem(item.id)}
                                        disabled={lineItems.length === 1}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="invoice-totals">
                    <div className="totals-grid">
                        <div className="total-row">
                            <span className="total-label">Subtotal:</span>
                            <span className="total-value">₹{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span className="total-label">Total Tax:</span>
                            <span className="total-value">₹{totals.totalTax.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span className="total-label">Total Discount:</span>
                            <span className="total-value text-danger">-₹{totals.totalDiscount.toFixed(2)}</span>
                        </div>
                        <div className="total-row grand-total">
                            <span className="total-label">Grand Total:</span>
                            <span className="total-value">₹{totals.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="invoice-actions">
                    <Button variant="success" size="lg" icon="✓" onClick={handleGenerate}>
                        Generate Invoice
                    </Button>
                    <Button variant="primary" size="lg" icon="📥">
                        Download PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
