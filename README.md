# N Company CRM System

A modern, professional SaaS-grade Customer Relationship Management (CRM) system built with React and premium UI design principles. This system provides comprehensive tools for managing invoices, clients, sales tracking, financial analytics, operations, and customer support.

## 🎯 Project Overview

N Company CRM is an internal CRM + Dashboard platform featuring **8 comprehensive modules** with a premium dark-mode UI comparable to industry leaders like Stripe, HubSpot, and Linear.

**Live Demo**: The application runs on `http://localhost:3000` (development)

## ✨ Key Features

### Core Modules

1. **📄 Invoice Generator** - Create professional invoices with auto-calculations
2. **📋 Invoice History** - Complete invoice management with search and filters
3. **👔 Executive Dashboard** - High-level KPIs and strategic insights
4. **📈 Sales Dashboard** - Performance tracking with real-time leaderboards
5. **⚙️ Operations Dashboard** - Kanban-style order fulfillment tracking
6. **💰 Financial Dashboard** - Revenue analysis and cash flow monitoring
7. **🎧 Customer Support Dashboard** - Ticket volume and team performance metrics
8. **👥 Client Management** - Full CRM pipeline with lifecycle tracking
9. **⚖️ Legal & Compliance** - Document repository for policies and terms

### Phase 2 Enhancements (Recently Completed)

- ✅ **Centralized Data Layer** - Single source of truth for all modules
- ✅ **Data Interconnections** - Consistent client names, invoice IDs, and salespeople across all dashboards
- ✅ **Real Calculations** - KPIs derived from actual invoice data
- ✅ **Invoice List Page** - Searchable, filterable invoice history
- ✅ **Client Lifetime Value** - Automatically calculated from invoice totals
- ✅ **Sales Leaderboard** - Calculated from actual sales performance

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Charts**: Recharts (for data visualization)
- **Styling**: Vanilla CSS with custom design system
- **State Management**: React hooks
- **Typography**: Inter font family

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "CRM System"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
CRM System/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── TopBar.jsx       # Top navigation bar
│   │   ├── StatCard.jsx     # KPI metric cards
│   │   ├── ChartCard.jsx    # Chart wrapper component
│   │   ├── Button.jsx       # Styled button component
│   │   ├── Badge.jsx        # Status badges
│   │   └── Input.jsx        # Form input components
│   │
│   ├── pages/               # Main application pages
│   │   ├── InvoiceGenerator.jsx
│   │   ├── InvoiceList.jsx
│   │   ├── ExecutiveDashboard.jsx
│   │   ├── SalesDashboard.jsx
│   │   ├── OperationsDashboard.jsx
│   │   ├── FinancialDashboard.jsx
│   │   ├── SupportDashboard.jsx
│   │   ├── ClientManagement.jsx
│   │   └── LegalCompliance.jsx
│   │
│   ├── data/                # Centralized data layer
│   │   └── centralData.js   # Single source of truth
│   │
│   ├── utils/               # Utility functions
│   │   └── dataCalculations.js  # Data calculation helpers
│   │
│   ├── styles/              # Global styles
│   │   ├── design-system.css    # Design tokens & variables
│   │   └── base.css             # Base styles & utilities
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── App.css              # App-specific styles
│
├── index.html               # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## 🎨 Design System

The CRM uses a premium dark-mode design system with:

- **Color Palette**: Professional dark backgrounds with vibrant accent colors
- **Typography**: Inter font family for clean, modern text
- **Spacing**: Consistent 4px-based spacing scale
- **Components**: Glassmorphism effects, gradient accents, smooth animations
- **Responsive**: Mobile-first design with breakpoints

## 💾 Data Architecture

### Centralized Data (`src/data/centralData.js`)

All modules consume data from a single source:

- **15 Clients** - Consistent across all modules (Acme Corporation, Tech Innovators, etc.)
- **20+ Invoices** - Spanning 6 months with realistic amounts
- **Transactions** - Payment records linked to invoices
- **Sales Team** - 5 salespeople (Rajesh Kumar, Priya Sharma, Amit Patel, Neha Singh, Ravi Gupta)

### Data Calculations (`src/utils/dataCalculations.js`)

Helper functions that derive metrics from central data:

- `getClientLifetimeValue()` - Sum of all client invoices
- `getSalesLeaderboard()` - Rankings from actual invoice data
- `getTotalRevenue()` - Aggregate revenue calculations
- `getProductRevenue()` - Revenue by product/service
- `formatCurrency()` - Consistent number formatting

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌟 Key Features Breakdown

### Invoice Generator
- Manual invoice creation with line items
- Auto-calculation of subtotals, tax, discounts, and totals
- Support for multiple services per invoice
- Client selection dropdown
- Tax breakdown (18% GST)

### Invoice History
- Complete list of all invoices
- Search by invoice number or client name
- Filter by status (Paid, Pending, Overdue)
- Summary statistics (Total Revenue, Paid Amount, Pending Amount)
- Export functionality (planned)

### Executive Dashboard
- **Real KPIs** calculated from actual invoice data
- Revenue trend charts (6-month view)
- Department performance metrics
- Top performing products (from invoice line items)
- Strategic initiatives tracking

### Sales Dashboard
- **Live Leaderboard** calculated from actual invoices
- Rajesh Kumar leads with ₹1.7M+ in revenue!
- Monthly sales performance charts
- Product mix pie chart
- Conversion rate tracking

### Client Management
- Complete CRM pipeline (Leads → Follow-ups → Converted → Completed → Repeat)
- **Client lifetime value** auto-calculated from invoices
- VIP badges for repeat clients
- Toggle between pipeline and list views
- 15 real clients with full contact details

### Financial Dashboard
- Revenue vs Cost analysis
- **Cash flow tracking** (Paid vs Pending invoices)
- Profit margin calculations
- Budget utilization charts

## 🔗 Data Interconnections

The system demonstrates true product coherence:

- ✅ Same **client names** appear everywhere (Acme Corporation shows in invoices, dashboards, and CRM)
- ✅ Same **invoice IDs** referenced across Operations and Financial modules
- ✅ Sales **leaderboard rankings** match actual invoice data
- ✅ Client **lifetime values** = sum of their actual invoices
- ✅ **Revenue numbers** consistent across all financial reports

**Example**: Acme Corporation (CLT001) has 3 invoices totaling ₹943K, which matches their lifetime value in Client Management.

## 🚧 Upcoming Features (Phase 3)

- [ ] Client Detail pages with activity timeline
- [ ] Invoice preview modal with print/download
- [ ] Global date range filters
- [ ] Export functionality (CSV, PDF, Excel)
- [ ] Company branding in invoices
- [ ] Billing/shipping address fields
- [ ] CGST/SGST/IGST tax breakdown
- [ ] Notes and comments system
- [ ] Backend integration (FastAPI + Google Sheets)

## 👥 Team Collaboration

### Getting Started for New Team Members

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Explore the codebase starting with `src/App.jsx`
5. Review `src/data/centralData.js` to understand the data structure

### Code Style

- Use functional components with hooks
- Follow existing naming conventions
- Keep components modular and reusable
- Use the design system variables from `design-system.css`
- Maintain consistent spacing and formatting

### Making Changes

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly in the dev environment
4. Commit with clear, descriptive messages
5. Submit a pull request

## 📊 Current Statistics

- **Total Invoices**: 20+
- **Total Clients**: 15
- **Total Revenue**: ₹7.8M+ (from all invoices)
- **Modules**: 8 fully functional
- **Components**: 15+ reusable UI components
- **Lines of Code**: ~5,000+

## 🎯 Success Metrics

✅ Premium SaaS-quality UI (Stripe/HubSpot level)  
✅ All 8 modules fully functional  
✅ Data coherence across all modules  
✅ Realistic, interconnected mock data  
✅ Professional charts and visualizations  
✅ Responsive design (desktop-optimized)  
✅ Clean, maintainable codebase  

## 📄 License

[Add your license here]

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Built with ❤️ by the N Company Team**

*Last Updated: January 22, 2026*
