// Centralized Data Structure - Single Source of Truth
// All modules consume data from here to ensure consistency

// ==================== CLIENTS ====================
export const clients = [
    {
        id: "CLT001",
        name: "Acme Corporation",
        contact: "Robert Taylor",
        email: "robert.taylor@acmecorp.com",
        phone: "+91-9876543210",
        stage: "repeat",
        joinedDate: "2024-08-15",
        industry: "Technology",
        address: {
            billing: "123 Tech Park, Sector 62, Noida, UP 201301",
            shipping: "123 Tech Park, Sector 62, Noida, UP 201301"
        }
    },
    {
        id: "CLT002",
        name: "Tech Innovators Ltd",
        contact: "Emma Wilson",
        email: "emma@techinnovators.com",
        phone: "+91-9876543211",
        stage: "repeat",
        joinedDate: "2024-09-10",
        industry: "Software",
        address: {
            billing: "45 Innovation Hub, Bangalore, KA 560001",
            shipping: "45 Innovation Hub, Bangalore, KA 560001"
        }
    },
    {
        id: "CLT003",
        name: "Global Solutions Inc",
        contact: "Michael Chen",
        email: "michael@globalsolutions.com",
        phone: "+91-9876543212",
        stage: "completed",
        joinedDate: "2025-01-05",
        industry: "Consulting",
        address: {
            billing: "78 Business District, Gurgaon, HR 122001",
            shipping: "78 Business District, Gurgaon, HR 122001"
        }
    },
    {
        id: "CLT004",
        name: "MegaCorp Industries",
        contact: "Lisa Davis",
        email: "lisa@megacorp.com",
        phone: "+91-9876543213",
        stage: "completed",
        joinedDate: "2025-02-20",
        industry: "Manufacturing",
        address: {
            billing: "234 Industrial Area, Pune, MH 411001",
            shipping: "234 Industrial Area, Pune, MH 411001"
        }
    },
    {
        id: "CLT005",
        name: "StartupXYZ",
        contact: "David Brown",
        email: "david@startupxyz.com",
        phone: "+91-9876543214",
        stage: "converted",
        joinedDate: "2025-10-15",
        industry: "E-commerce",
        address: {
            billing: "12 Startup Plaza, Mumbai, MH 400001",
            shipping: "12 Startup Plaza, Mumbai, MH 400001"
        }
    },
    {
        id: "CLT006",
        name: "Innovators LLC",
        contact: "Sarah Williams",
        email: "sarah@innovators.com",
        phone: "+91-9876543215",
        stage: "converted",
        joinedDate: "2025-11-01",
        industry: "Design",
        address: {
            billing: "56 Creative Tower, Delhi, DL 110001",
            shipping: "56 Creative Tower, Delhi, DL 110001"
        }
    },
    {
        id: "CLT007",
        name: "Alpha Corp",
        contact: "John Doe",
        email: "john@alphacorp.com",
        phone: "+91-9876543216",
        stage: "leads",
        joinedDate: "2026-01-10",
        industry: "Finance",
        address: {
            billing: "89 Finance Street, Chennai, TN 600001",
            shipping: "89 Finance Street, Chennai, TN 600001"
        }
    },
    {
        id: "CLT008",
        name: "Beta Solutions",
        contact: "Jane Smith",
        email: "jane@betasolutions.com",
        phone: "+91-9876543217",
        stage: "leads",
        joinedDate: "2026-01-12",
        industry: "Healthcare",
        address: {
            billing: "34 Medical Complex, Hyderabad, TS 500001",
            shipping: "34 Medical Complex, Hyderabad, TS 500001"
        }
    },
    {
        id: "CLT009",
        name: "Gamma Tech",
        contact: "Mike Johnson",
        email: "mike@gammatech.com",
        phone: "+91-9876543218",
        stage: "followUps",
        joinedDate: "2025-12-05",
        industry: "AI/ML",
        address: {
            billing: "67 AI Park, Bangalore, KA 560002",
            shipping: "67 AI Park, Bangalore, KA 560002"
        }
    },
    {
        id: "CLT010",
        name: "Delta Industries",
        contact: "Emily Rodriguez",
        email: "emily@deltaindustries.com",
        phone: "+91-9876543219",
        stage: "converted",
        joinedDate: "2025-09-15",
        industry: "Logistics",
        address: {
            billing: "45 Logistics Hub, Kolkata, WB 700001",
            shipping: "45 Logistics Hub, Kolkata, WB 700001"
        }
    },
    {
        id: "CLT011",
        name: "Epsilon LLC",
        contact: "James Anderson",
        email: "james@epsilon.com",
        phone: "+91-9876543220",
        stage: "converted",
        joinedDate: "2025-10-20",
        industry: "Real Estate",
        address: {
            billing: "90 Property Plaza, Ahmedabad, GJ 380001",
            shipping: "90 Property Plaza, Ahmedabad, GJ 380001"
        }
    },
    {
        id: "CLT012",
        name: "Zeta Enterprises",
        contact: "Maria Garcia",
        email: "maria@zeta.com",
        phone: "+91-9876543221",
        stage: "completed",
        joinedDate: "2024-07-10",
        industry: "Retail",
        address: {
            billing: "123 Retail Street, Jaipur, RJ 302001",
            shipping: "123 Retail Street, Jaipur, RJ 302001"
        }
    },
    {
        id: "CLT013",
        name: "Theta Systems",
        contact: "Daniel Lee",
        email: "daniel@thetasystems.com",
        phone: "+91-9876543222",
        stage: "repeat",
        joinedDate: "2024-06-01",
        industry: "Cloud Services",
        address: {
            billing: "78 Cloud Tower, Pune, MH 411002",
            shipping: "78 Cloud Tower, Pune, MH 411002"
        }
    },
    {
        id: "CLT014",
        name: "Iota Ventures",
        contact: "Sophia Martinez",
        email: "sophia@iotaventures.com",
        phone: "+91-9876543223",
        stage: "followUps",
        joinedDate: "2025-12-20",
        industry: "Investment",
        address: {
            billing: "56 Investment Plaza, Mumbai, MH 400002",
            shipping: "56 Investment Plaza, Mumbai, MH 400002"
        }
    },
    {
        id: "CLT015",
        name: "Kappa Digital",
        contact: "Alexander White",
        email: "alex@kappadigital.com",
        phone: "+91-9876543224",
        stage: "repeat",
        joinedDate: "2024-05-15",
        industry: "Digital Marketing",
        address: {
            billing: "34 Marketing Hub, Gurgaon, HR 122002",
            shipping: "34 Marketing Hub, Gurgaon, HR 122002"
        }
    }
];

// ==================== INVOICES ====================
export const invoices = [
    // Acme Corporation Invoices (CLT001) - Repeat Client
    {
        invoiceNumber: "INV-2025-045",
        clientId: "CLT001",
        date: "2025-08-20",
        dueDate: "2025-09-20",
        status: "paid",
        items: [
            { service: "Enterprise License", description: "Annual subscription - 10 users", quantity: 10, unitPrice: 50000, tax: 18, discount: 10 }
        ],
        subtotal: 500000,
        totalTax: 90000,
        totalDiscount: 50000,
        grandTotal: 540000,
        salesPerson: "Rajesh Kumar",
        createdBy: "Operations Manager",
        paidDate: "2025-09-05"
    },
    {
        invoiceNumber: "INV-2025-078",
        clientId: "CLT001",
        date: "2025-11-15",
        dueDate: "2025-12-15",
        status: "paid",
        items: [
            { service: "Consulting Services", description: "Strategic planning - 40 hours", quantity: 40, unitPrice: 5000, tax: 18, discount: 5 }
        ],
        subtotal: 200000,
        totalTax: 36000,
        totalDiscount: 10000,
        grandTotal: 226000,
        salesPerson: "Rajesh Kumar",
        createdBy: "Operations Manager",
        paidDate: "2025-12-10"
    },
    {
        invoiceNumber: "INV-2026-012",
        clientId: "CLT001",
        date: "2026-01-10",
        dueDate: "2026-02-10",
        status: "paid",
        items: [
            { service: "Support Package", description: "Premium support - Q1 2026", quantity: 1, unitPrice: 150000, tax: 18, discount: 0 }
        ],
        subtotal: 150000,
        totalTax: 27000,
        totalDiscount: 0,
        grandTotal: 177000,
        salesPerson: "Rajesh Kumar",
        createdBy: "Operations Manager",
        paidDate: "2026-01-20"
    },

    // Tech Innovators Ltd (CLT002) - Repeat Client
    {
        invoiceNumber: "INV-2025-052",
        clientId: "CLT002",
        date: "2025-09-05",
        dueDate: "2025-10-05",
        status: "paid",
        items: [
            { service: "Custom Development", description: "Custom CRM module", quantity: 80, unitPrice: 8000, tax: 18, discount: 15 }
        ],
        subtotal: 640000,
        totalTax: 115200,
        totalDiscount: 96000,
        grandTotal: 659200,
        salesPerson: "Priya Sharma",
        createdBy: "Operations Manager",
        paidDate: "2025-09-28"
    },
    {
        invoiceNumber: "INV-2026-005",
        clientId: "CLT002",
        date: "2026-01-05",
        dueDate: "2026-02-05",
        status: "pending",
        items: [
            { service: "Professional License", description: "6-month subscription - 15 users", quantity: 15, unitPrice: 25000, tax: 18, discount: 10 }
        ],
        subtotal: 375000,
        totalTax: 67500,
        totalDiscount: 37500,
        grandTotal: 405000,
        salesPerson: "Priya Sharma",
        createdBy: "Operations Manager"
    },

    // Global Solutions Inc (CLT003)
    {
        invoiceNumber: "INV-2025-062",
        clientId: "CLT003",
        date: "2025-10-10",
        dueDate: "2025-11-10",
        status: "paid",
        items: [
            { service: "Consulting Services", description: "Business process optimization", quantity: 60, unitPrice: 6000, tax: 18, discount: 5 }
        ],
        subtotal: 360000,
        totalTax: 64800,
        totalDiscount: 18000,
        grandTotal: 406800,
        salesPerson: "Amit Patel",
        createdBy: "Operations Manager",
        paidDate: "2025-11-02"
    },

    // MegaCorp Industries (CLT004)
    {
        invoiceNumber: "INV-2025-070",
        clientId: "CLT004",
        date: "2025-11-01",
        dueDate: "2025-12-01",
        status: "paid",
        items: [
            { service: "Enterprise License", description: "Annual subscription - 25 users", quantity: 25, unitPrice: 45000, tax: 18, discount: 12 }
        ],
        subtotal: 1125000,
        totalTax: 202500,
        totalDiscount: 135000,
        grandTotal: 1192500,
        salesPerson: "Neha Singh",
        createdBy: "Operations Manager",
        paidDate: "2025-11-25"
    },

    // StartupXYZ (CLT005)
    {
        invoiceNumber: "INV-2025-085",
        clientId: "CLT005",
        date: "2025-12-01",
        dueDate: "2026-01-01",
        status: "paid",
        items: [
            { service: "Starter Package", description: "Basic CRM setup - 5 users", quantity: 5, unitPrice: 15000, tax: 18, discount: 20 }
        ],
        subtotal: 75000,
        totalTax: 13500,
        totalDiscount: 15000,
        grandTotal: 73500,
        salesPerson: "Ravi Gupta",
        createdBy: "Operations Manager",
        paidDate: "2025-12-15"
    },
    {
        invoiceNumber: "INV-2026-008",
        clientId: "CLT005",
        date: "2026-01-08",
        dueDate: "2026-02-08",
        status: "pending",
        items: [
            { service: "Training Services", description: "Team training - 2 days", quantity: 2, unitPrice: 30000, tax: 18, discount: 0 }
        ],
        subtotal: 60000,
        totalTax: 10800,
        totalDiscount: 0,
        grandTotal: 70800,
        salesPerson: "Ravi Gupta",
        createdBy: "Operations Manager"
    },

    // Continue with more invoices for other clients...
    // Innovators LLC (CLT006)
    {
        invoiceNumber: "INV-2025-092",
        clientId: "CLT006",
        date: "2025-12-10",
        dueDate: "2026-01-10",
        status: "overdue",
        items: [
            { service: "Design Package", description: "UI/UX design services", quantity: 30, unitPrice: 5000, tax: 18, discount: 8 }
        ],
        subtotal: 150000,
        totalTax: 27000,
        totalDiscount: 12000,
        grandTotal: 165000,
        salesPerson: "Priya Sharma",
        createdBy: "Operations Manager"
    },

    // Delta Industries (CLT010)
    {
        invoiceNumber: "INV-2025-068",
        clientId: "CLT010",
        date: "2025-10-20",
        dueDate: "2025-11-20",
        status: "paid",
        items: [
            { service: "Professional License", description: "Annual subscription - 20 users", quantity: 20, unitPrice: 30000, tax: 18, discount: 10 }
        ],
        subtotal: 600000,
        totalTax: 108000,
        totalDiscount: 60000,
        grandTotal: 648000,
        salesPerson: "Amit Patel",
        createdBy: "Operations Manager",
        paidDate: "2025-11-10"
    },

    // Epsilon LLC (CLT011)
    {
        invoiceNumber: "INV-2025-075",
        clientId: "CLT011",
        date: "2025-11-10",
        dueDate: "2025-12-10",
        status: "paid",
        items: [
            { service: "Consulting Services", description: "Real estate CRM customization", quantity: 50, unitPrice: 7000, tax: 18, discount: 10 }
        ],
        subtotal: 350000,
        totalTax: 63000,
        totalDiscount: 35000,
        grandTotal: 378000,
        salesPerson: "Neha Singh",
        createdBy: "Operations Manager",
        paidDate: "2025-12-05"
    },

    // Zeta Enterprises (CLT012)
    {
        invoiceNumber: "INV-2025-040",
        clientId: "CLT012",
        date: "2025-08-05",
        dueDate: "2025-09-05",
        status: "paid",
        items: [
            { service: "Enterprise License", description: "Retail management system - 30 users", quantity: 30, unitPrice: 40000, tax: 18, discount: 15 }
        ],
        subtotal: 1200000,
        totalTax: 216000,
        totalDiscount: 180000,
        grandTotal: 1236000,
        salesPerson: "Rajesh Kumar",
        createdBy: "Operations Manager",
        paidDate: "2025-08-30"
    },

    // Theta Systems (CLT013) - Repeat Client
    {
        invoiceNumber: "INV-2025-035",
        clientId: "CLT013",
        date: "2025-07-15",
        dueDate: "2025-08-15",
        status: "paid",
        items: [
            { service: "Cloud Integration", description: "AWS/Azure integration services", quantity: 100, unitPrice: 4000, tax: 18, discount: 12 }
        ],
        subtotal: 400000,
        totalTax: 72000,
        totalDiscount: 48000,
        grandTotal: 424000,
        salesPerson: "Ravi Gupta",
        createdBy: "Operations Manager",
        paidDate: "2025-08-10"
    },
    {
        invoiceNumber: "INV-2025-088",
        clientId: "CLT013",
        date: "2025-12-05",
        dueDate: "2026-01-05",
        status: "paid",
        items: [
            { service: "Support Package", description: "Premium cloud support - 6 months", quantity: 1, unitPrice: 200000, tax: 18, discount: 5 }
        ],
        subtotal: 200000,
        totalTax: 36000,
        totalDiscount: 10000,
        grandTotal: 226000,
        salesPerson: "Ravi Gupta",
        createdBy: "Operations Manager",
        paidDate: "2025-12-28"
    },
    {
        invoiceNumber: "INV-2026-015",
        clientId: "CLT013",
        date: "2026-01-15",
        dueDate: "2026-02-15",
        status: "pending",
        items: [
            { service: "Cloud Optimization", description: "Performance tuning services", quantity: 40, unitPrice: 6000, tax: 18, discount: 0 }
        ],
        subtotal: 240000,
        totalTax: 43200,
        totalDiscount: 0,
        grandTotal: 283200,
        salesPerson: "Ravi Gupta",
        createdBy: "Operations Manager"
    },

    // Kappa Digital (CLT015) - Repeat Client
    {
        invoiceNumber: "INV-2025-030",
        clientId: "CLT015",
        date: "2025-07-01",
        dueDate: "2025-08-01",
        status: "paid",
        items: [
            { service: "Marketing Automation", description: "CRM marketing module", quantity: 1, unitPrice: 350000, tax: 18, discount: 10 }
        ],
        subtotal: 350000,
        totalTax: 63000,
        totalDiscount: 35000,
        grandTotal: 378000,
        salesPerson: "Priya Sharma",
        createdBy: "Operations Manager",
        paidDate: "2025-07-25"
    },
    {
        invoiceNumber: "INV-2025-095",
        clientId: "CLT015",
        date: "2025-12-15",
        dueDate: "2026-01-15",
        status: "paid",
        items: [
            { service: "Professional License", description: "Annual renewal - 12 users", quantity: 12, unitPrice: 28000, tax: 18, discount: 12 }
        ],
        subtotal: 336000,
        totalTax: 60480,
        totalDiscount: 40320,
        grandTotal: 356160,
        salesPerson: "Priya Sharma",
        createdBy: "Operations Manager",
        paidDate: "2026-01-10"
    },
    {
        invoiceNumber: "INV-2026-018",
        clientId: "CLT015",
        date: "2026-01-18",
        dueDate: "2026-02-18",
        status: "pending",
        items: [
            { service: "Consulting Services", description: "Marketing strategy consultation", quantity: 20, unitPrice: 8000, tax: 18, discount: 5 }
        ],
        subtotal: 160000,
        totalTax: 28800,
        totalDiscount: 8000,
        grandTotal: 180800,
        salesPerson: "Priya Sharma",
        createdBy: "Operations Manager"
    },

    // Add more invoices for January 2026
    {
        invoiceNumber: "INV-2026-020",
        clientId: "CLT002",
        date: "2026-01-20",
        dueDate: "2026-02-20",
        status: "pending",
        items: [
            { service: "API Integration", description: "Third-party API connections", quantity: 15, unitPrice: 10000, tax: 18, discount: 8 }
        ],
        subtotal: 150000,
        totalTax: 27000,
        totalDiscount: 12000,
        grandTotal: 165000,
        salesPerson: "Priya Sharma",
        createdBy: "Operations Manager"
    },
    {
        invoiceNumber: "INV-2026-022",
        clientId: "CLT004",
        date: "2026-01-22",
        dueDate: "2026-02-22",
        status: "pending",
        items: [
            { service: "Training Services", description: "Advanced user training", quantity: 3, unitPrice: 25000, tax: 18, discount: 0 }
        ],
        subtotal: 75000,
        totalTax: 13500,
        totalDiscount: 0,
        grandTotal: 88500,
        salesPerson: "Neha Singh",
        createdBy: "Operations Manager"
    }
];

// ==================== TRANSACTIONS ====================
export const transactions = invoices
    .filter(inv => inv.status === 'paid')
    .map((inv, index) => ({
        id: `TXN-${String(index + 1).padStart(3, '0')}`,
        invoiceId: inv.invoiceNumber,
        date: inv.paidDate,
        amount: inv.grandTotal,
        type: 'payment',
        method: index % 3 === 0 ? 'bank_transfer' : index % 3 === 1 ? 'upi' : 'cheque'
    }));

// ==================== COMPANY INFO ====================
export const companyInfo = {
    name: "N Company",
    logo: "NC", // Can be replaced with actual logo
    address: "456 Business Tower, Cyber City, Gurgaon, Haryana 122002",
    phone: "+91-124-4567890",
    email: "info@ncompany.com",
    website: "www.ncompany.com",
    gstin: "06AAAAA0000A1Z5",
    pan: "AAAAA0000A"
};

export default { clients, invoices, transactions, companyInfo };
