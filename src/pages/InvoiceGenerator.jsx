import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Input, Select } from '../components/Input';
import { invoiceAPI } from '../services/api';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
    // Form states
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [manualInvoiceId, setManualInvoiceId] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientId, setClientId] = useState(''); // Store the selected client's ID
    const [salesPerson, setSalesPerson] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');

    // UI states
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [invoiceIdError, setInvoiceIdError] = useState('');
    const [showAddClientModal, setShowAddClientModal] = useState(false);

    // Line items
    const [lineItems, setLineItems] = useState([
        { id: 1, service: '', description: '', quantity: 1, unitPrice: 0, tax: 18, discount: 0 }
    ]);

    // Client data for suggestions - Fetch from backend
    const [clients, setClients] = useState([]);
    const [clientSuggestions, setClientSuggestions] = useState([]);

    // Sales person suggestions
    const [salesPersonSuggestions, setSalesPersonSuggestions] = useState([
        'Rajesh Kumar',
        'Priya Sharma',
        'Amit Patel',
        'Neha Singh',
        'Ravi Gupta'
    ]);

    // New client form states
    const [newClient, setNewClient] = useState({
        name: '',
        contact: '',
        email: '',
        phone: '',
        industry: '',
        address: ''
    });

    // Fetch clients on mount
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/clients', {
                    headers: { 'X-API-Key': 'dev-api-key-12345' }
                });
                const data = await response.json();
                if (data.success && data.data) {
                    setClients(data.data);
                    setClientSuggestions(data.data.map(c => c.name));
                }
            } catch (error) {
                console.error('Failed to fetch clients:', error);
            }
        };
        fetchClients();
    }, []);

    // Check invoice ID uniqueness
    const checkInvoiceId = async (invId) => {
        if (!invId || invId.length < 3) {
            setInvoiceIdError('');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/invoices/${invId}`, {
                headers: { 'X-API-Key': 'dev-api-key-12345' }
            });

            if (response.ok) {
                setInvoiceIdError('⚠️ This Invoice ID already exists in the database');
            } else {
                setInvoiceIdError('');
            }
        } catch (error) {
            setInvoiceIdError('');
        }
    };

    // Handle invoice ID input
    const handleInvoiceIdChange = (e) => {
        const value = e.target.value.toUpperCase();
        setManualInvoiceId(value);

        // Debounce check
        if (value) {
            setTimeout(() => checkInvoiceId(value), 500);
        } else {
            setInvoiceIdError('');
        }
    };

    // Line item functions
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

    // Handle invoice generation
    const handleGenerate = async () => {
        // Validation
        if (invoiceIdError) {
            setErrorMessage('Please use a unique Invoice ID');
            return;
        }

        if (!manualInvoiceId) {
            setErrorMessage('Please enter an Invoice ID');
            return;
        }

        if (!clientName || clientName.trim() === '') {
            setErrorMessage('Please enter or select a client name');
            return;
        }

        if (!salesPerson || salesPerson.trim() === '') {
            setErrorMessage('Please enter or select a salesperson');
            return;
        }

        if (!invoiceDate) {
            setErrorMessage('Please select an invoice date');
            return;
        }

        if (!dueDate) {
            setErrorMessage('Please select a due date');
            return;
        }

        if (lineItems.length === 0 || !lineItems[0].service) {
            setErrorMessage('Please add at least one line item');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Find the actual client by name to get their client_id
            const selectedClient = clients.find(c => c.name.toLowerCase() === clientName.trim().toLowerCase());

            let finalClientId;
            if (selectedClient) {
                // Use existing client's ID
                finalClientId = selectedClient.client_id;
                console.log(`Using existing client: ${clientName} (${finalClientId})`);
            } else if (clientId) {
                // Use the clientId if it was set from "Add New Client"
                finalClientId = clientId;
                console.log(`Using newly created client ID: ${finalClientId}`);
            } else {
                // This shouldn't happen, but fallback to error
                setErrorMessage('Client not found. Please select an existing client or add a new one.');
                setLoading(false);
                return;
            }

            const invoiceData = {
                invoice_id: manualInvoiceId,
                client_id: finalClientId,
                client_name: clientName.trim(),
                invoice_date: invoiceDate,
                due_date: dueDate,
                sales_person: salesPerson.trim(),
                items: lineItems.map(item => ({
                    service: item.service,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    tax_percent: item.tax,
                    discount_percent: item.discount
                }))
            };

            // Save to backend
            const result = await invoiceAPI.createInvoice(invoiceData);

            // Add new names to suggestions if not already there
            if (!clientSuggestions.includes(clientName.trim())) {
                setClientSuggestions([...clientSuggestions, clientName.trim()]);
            }
            if (!salesPersonSuggestions.includes(salesPerson.trim())) {
                setSalesPersonSuggestions([...salesPersonSuggestions, salesPerson.trim()]);
            }

            // Success!
            setSuccessMessage(`✓ Invoice ${result.invoice_id} created successfully! Total: ₹${result.grand_total}`);
            setInvoiceNumber(result.invoice_id);

            // Clear form after 3 seconds
            setTimeout(() => {
                clearForm();
            }, 3000);

        } catch (error) {
            setErrorMessage(`Failed to create invoice: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setInvoiceNumber('');
        setManualInvoiceId('');
        setClientName('');
        setSalesPerson('');
        setInvoiceDate(new Date().toISOString().split('T')[0]);
        setDueDate('');
        setLineItems([{ id: 1, service: '', description: '', quantity: 1, unitPrice: 0, tax: 18, discount: 0 }]);
        setSuccessMessage('');
        setErrorMessage('');
        setInvoiceIdError('');
    };

    // Handle Download PDF
    const handleDownloadPDF = () => {
        // Validate that required fields are filled
        if (!manualInvoiceId.trim()) {
            setErrorMessage('Please enter an Invoice ID before downloading PDF');
            return;
        }
        if (!clientName.trim()) {
            setErrorMessage('Please enter a Client Name before downloading PDF');
            return;
        }
        if (!invoiceDate || !dueDate) {
            setErrorMessage('Please enter Invoice Date and Due Date before downloading PDF');
            return;
        }
        if (lineItems.length === 0 || !lineItems[0].service) {
            setErrorMessage('Please add at least one line item before downloading PDF');
            return;
        }

        try {
            // Prepare invoice data for PDF
            const invoiceData = {
                invoice_id: manualInvoiceId,
                client_name: clientName.trim(),
                invoice_date: invoiceDate,
                due_date: dueDate,
                sales_person: salesPerson.trim() || 'N/A',
                items: lineItems.map(item => ({
                    service: item.service,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    tax_percent: item.tax,
                    discount_percent: item.discount
                })),
                totals: totals
            };

            // Generate and download PDF
            const filename = generateInvoicePDF(invoiceData);
            setSuccessMessage(`PDF downloaded successfully: ${filename}`);

            // Clear error message if any
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(`Failed to generate PDF: ${error.message}`);
        }
    };

    // Handle Add New Client
    const handleAddClient = () => {
        // Pre-fill with current client name if entered
        setNewClient({ ...newClient, name: clientName });
        setShowAddClientModal(true);
    };

    const handleSaveNewClient = async () => {
        if (!newClient.name.trim()) {
            alert('Please enter a client name');
            return;
        }

        try {
            setLoading(true);
            setErrorMessage('');

            // Call backend API to save client to Google Sheets
            const { clientAPI } = await import('../services/clientAPI');
            const savedClient = await clientAPI.createClient({
                name: newClient.name.trim(),
                contact: newClient.contact.trim() || null,
                email: newClient.email.trim() || null,
                phone: newClient.phone.trim() || null,
                industry: newClient.industry.trim() || null,
                address: newClient.address.trim() || null
            });

            // Add to suggestions
            if (!clientSuggestions.includes(savedClient.name)) {
                setClientSuggestions([...clientSuggestions, savedClient.name]);
            }

            // Set as current client (use the name from saved client)
            setClientName(savedClient.name);
            setClientId(savedClient.client_id); // Set the generated client ID

            // Show success message
            setSuccessMessage(`Client "${savedClient.name}" (${savedClient.client_id}) added successfully!`);

            // Close modal and reset
            setShowAddClientModal(false);
            setNewClient({ name: '', contact: '', email: '', phone: '', industry: '', address: '' });
        } catch (error) {
            setErrorMessage(`Failed to save client: ${error.message}`);
            console.error('Error saving client:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invoice-page">
            <div className="invoice-header">
                <div>
                    <h2>Create New Invoice</h2>
                    <p className="invoice-subtitle">Generate professional invoices - saved to Google Sheets in real-time</p>
                </div>
                <div className="invoice-actions-header">
                    <Button variant="ghost" onClick={clearForm}>Clear Form</Button>
                    <Button variant="outline">Save Draft</Button>
                </div>
            </div>

            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="alert alert-error">
                    ✗ {errorMessage}
                </div>
            )}

            <div className="invoice-container">
                <div className="invoice-form-section">
                    <h3 className="section-title">Invoice Details</h3>
                    <div className="form-grid">
                        <div>
                            <label className="input-label">Invoice ID * (Must be unique)</label>
                            <input
                                className="form-input"
                                placeholder="ACWB50000 (Example)"
                                value={manualInvoiceId}
                                onChange={handleInvoiceIdChange}
                                style={{ borderColor: invoiceIdError ? '#ef4444' : '' }}
                            />
                            {invoiceIdError && <div className="field-error">{invoiceIdError}</div>}
                            <div className="invoice-id-helper">
                                <strong>Format:</strong> [Client Initials (2)] + [Work Type (2)] + [Price (4 digits)]
                                <div className="invoice-id-example">
                                    Example: AC + WB + 5000 = ACWB5000 (Acme Corp, Web Dev, ₹50,000)
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Client Name * (Type or Select)</label>
                            <input
                                className="form-input"
                                list="client-list"
                                placeholder="Type or select client name"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                            <datalist id="client-list">
                                {clientSuggestions.map((client, idx) => (
                                    <option key={idx} value={client} />
                                ))}
                            </datalist>
                        </div>

                        <Input
                            label="Invoice Date *"
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            required
                        />

                        <Input
                            label="Due Date *"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />

                        <div>
                            <label className="input-label">Sales Person * (Type or Select)</label>
                            <input
                                className="form-input"
                                list="salesperson-list"
                                placeholder="Type or select salesperson"
                                value={salesPerson}
                                onChange={(e) => setSalesPerson(e.target.value)}
                            />
                            <datalist id="salesperson-list">
                                {salesPersonSuggestions.map((person, idx) => (
                                    <option key={idx} value={person} />
                                ))}
                            </datalist>
                        </div>

                        <div className="add-client-wrapper">
                            <label className="input-label">Quick Action</label>
                            <Button variant="secondary" size="sm" icon="➕" onClick={handleAddClient}>
                                Add New Client
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Line Items Section - same as before */}
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

                {/* Totals - same as before */}
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
                    <Button
                        variant="success"
                        size="lg"
                        icon={loading ? "⏳" : "✓"}
                        onClick={handleGenerate}
                        disabled={loading || !!invoiceIdError}
                    >
                        {loading ? 'Creating Invoice...' : 'Generate Invoice'}
                    </Button>
                    <Button variant="primary" size="lg" icon="📥" onClick={handleDownloadPDF}>
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Add New Client Modal */}
            {showAddClientModal && (
                <div className="modal-overlay" onClick={() => setShowAddClientModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add New Client</h3>
                        <div className="modal-form">
                            <Input
                                label="Client Name *"
                                value={newClient.name}
                                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                placeholder="Company name"
                            />
                            <Input
                                label="Contact Person"
                                value={newClient.contact}
                                onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                                placeholder="Contact name"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={newClient.email}
                                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                placeholder="email@example.com"
                            />
                            <Input
                                label="Phone"
                                value={newClient.phone}
                                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                placeholder="+91-XXXXXXXXXX"
                            />
                            <Input
                                label="Industry"
                                value={newClient.industry}
                                onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                                placeholder="Technology, Finance, etc."
                            />
                            <Input
                                label="Address"
                                value={newClient.address}
                                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                                placeholder="Full address"
                            />
                        </div>
                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setShowAddClientModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveNewClient}>
                                Save Client
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceGenerator;
