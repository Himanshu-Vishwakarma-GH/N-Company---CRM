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

### Phase 2 Enhancements (Completed)

- ✅ **Centralized Data Layer** - Single source of truth for all modules
- ✅ **Data Interconnections** - Consistent client names, invoice IDs, and salespeople across all dashboards
- ✅ **Real Calculations** - KPIs derived from actual invoice data
- ✅ **Invoice List Page** - Searchable, filterable invoice history
- ✅ **Client Lifetime Value** - Automatically calculated from invoice totals
- ✅ **Sales Leaderboard** - Calculated from actual sales performance

### Phase 3 - Backend Integration ✅ (Completed Jan 23, 2026)

- ✅ **FastAPI Backend** - Production-ready REST API with clean architecture
- ✅ **Google Sheets Database** - Real-time data synchronization
- ✅ **Invoice API** - Complete CRUD operations (Create, Read, Update, List)
- ✅ **API Documentation** - Interactive Swagger UI at `/docs`
- ✅ **Frontend-Backend Integration** - React app connected to FastAPI
- ✅ **Real-time Data Sync** - Invoices saved to Google Sheets instantly
- ✅ **Authentication** - API key-based auth (JWT planned for Phase 5)

### Phase 4 - Enhanced Invoice Generator ✅ (Completed Jan 23, 2026)

- ✅ **Manual Invoice ID** - Custom format: Client Initials + Work Type + Price (e.g., ACWB5000)
- ✅ **Real-time Validation** - Uniqueness check against database
- ✅ **Combo Inputs** - Type new names OR select from existing dropdowns
- ✅ **Client Name Flexibility** - Manual entry + autocomplete suggestions
- ✅ **Salesperson Flexibility** - Manual entry + autocomplete suggestions  
- ✅ **Add New Client Modal** - Full client creation form (6 fields)
- ✅ **Data Persistence** - New names saved for future use
- ✅ **Format Helper** - Built-in guide for invoice ID format

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Charts**: Recharts (data visualization)
- **Styling**: Vanilla CSS with custom design system
- **State Management**: React hooks
- **Typography**: Inter font family

### Backend  
- **Framework**: FastAPI (Python)
- **Database**: Google Sheets API (Phase 1), PostgreSQL ready (Phase 2)
- **Validation**: Pydantic v2
- **Authentication**: API Key (current), JWT (planned)
- **Architecture**: Clean separation (Routers → Services → Data Layer)
- **Documentation**: Auto-generated Swagger/OpenAPI

## 📋 Prerequisites

### Frontend
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend
- Python 3.10+
- Google Cloud Project with Sheets API enabled
- Service Account credentials
- pip package manager

## 🚀 Installation

### Frontend Setup

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

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Google Sheets** (See `backend/GOOGLE_SHEETS_SETUP.md`)
   - Create Google Cloud Project
   - Enable Sheets API
   - Create Service Account
   - Download credentials JSON
   - Share spreadsheet with service account

4. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your spreadsheet ID
   ```

5. **Start backend server**
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Access API docs**
   Navigate to `http://localhost:8000/docs`

## 📁 Project Structure

```
CRM System/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   ├── TopBar.jsx       # Top navigation bar
│   │   │   ├── StatCard.jsx     # KPI metric cards
│   │   │   ├── ChartCard.jsx    # Chart wrapper component
│   │   │   ├── Button.jsx       # Styled button component
│   │   │   ├── Badge.jsx        # Status badges
│   │   │   └── Input.jsx        # Form input components
│   │   │
│   │   ├── pages/               # Main application pages
│   │   │   ├── InvoiceGenerator.jsx      # ⭐ Enhanced with Phase 4
│   │   │   ├── InvoiceList.jsx
│   │   │   ├── ExecutiveDashboard.jsx
│   │   │   ├── SalesDashboard.jsx
│   │   │   ├── OperationsDashboard.jsx
│   │   │   ├── FinancialDashboard.jsx
│   │   │   ├── SupportDashboard.jsx
│   │   │   ├── ClientManagement.jsx
│   │   │   └── LegalCompliance.jsx
│   │   │
│   │   ├── services/            # API integration
│   │   │   ├── api.js           # Invoice API calls
│   │   │   └── clientAPI.js     # Client API calls
│   │   │
│   │   ├── data/                # Centralized data layer
│   │   │   └── centralData.js   # Single source of truth
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   └── dataCalculations.js  # Data calculation helpers
│   │   │
│   │   ├── styles/              # Global styles
│   │   │   ├── design-system.css    # Design tokens & variables
│   │   │   └── base.css             # Base styles & utilities
│   │   │
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # App entry point
│   │   └── App.css              # App-specific styles
│   │
│   ├── index.html               # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Dependencies
│
├── backend/                     # ⭐ New in Phase 3
│   ├── app/
│   │   ├── main.py             # FastAPI application
│   │   ├── core/
│   │   │   ├── config.py       # Environment config
│   │   │   └── dependencies.py # Auth dependencies
│   │   ├── routers/
│   │   │   └── invoice.py      # Invoice endpoints
│   │   ├── services/
│   │   │   ├── sheets_service.py    # Google Sheets integration
│   │   │   └── invoice_service.py   # Business logic
│   │   ├── schemas/
│   │   │   └── invoice.py      # Pydantic models
│   │   └── models/
│   ├── credentials/
│   │   └── service-account.json     # Google credentials (gitignored)
│   ├── requirements.txt
│   ├── .env                    # Environment variables (gitignored)
│   └── README.md
│
└── README.md                   # This file
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

### Invoice Generator ⭐ (Enhanced in Phase 4)
- **Manual Invoice ID Creation** with custom format
  - Format: Client Initials + Work Type + Price (e.g., ACWB5000 = Acme Corp + Web + ₹50,000)
  - Real-time uniqueness validation against database
  - Visual helper with format examples
- **Flexible Client Selection**
  - Type new client names manually OR select from dropdown
  - Autocomplete suggestions from existing clients
  - Add New Client modal with full details (name, email, phone, industry, address)
- **Flexible Salesperson Selection**
  - Manual entry OR dropdown selection
  - Autocomplete from existing salespeople
  - New names automatically saved for future use
- **Auto-calculation** of subtotals, tax (18% GST), discounts, and grand totals
- **Multiple line items** with quantity, unit price, tax, and discount per item
- **Real-time totals** update as you type
- **Save to Google Sheets** with one click
- **Success/Error messages** with invoice ID confirmation

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

## 🚧 Upcoming Features (Phase 5)

- [ ] **PostgreSQL Migration** - Move from Google Sheets to PostgreSQL
- [ ] **JWT Authentication** - Secure user authentication and sessions
- [ ] **Client Detail Pages** - Full client profiles with activity timeline
- [ ] **Invoice Preview Modal** - Print/download functionality
- [ ] **Global Date Range Filters** - Filter data across all modules
- [ ] **Export Functionality** - CSV, PDF, Excel exports
- [ ] **Company Branding** - Custom logos and branding in invoices
- [ ] **Advanced Tax Options** - CGST/SGST/IGST breakdown
- [ ] **Notes & Comments System** - Collaboration features
- [ ] **Email Integration** - Send invoices directly to clients

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

- **Total Modules**: 8 fully functional
- **Backend APIs**: 4 endpoints (Create, Read, List, Update)
- **Components**: 20+ reusable UI components  
- **Frontend Lines of Code**: ~6,000+
- **Backend Lines of Code**: ~1,500+
- **Database**: Google Sheets (3 sheets: Invoices, Invoice_Items, Clients)
- **Real-time Features**: Invoice creation, data sync, validation

## 🎯 Success Metrics

✅ Premium SaaS-quality UI (Stripe/HubSpot level)  
✅ All 8 modules fully functional  
✅ **Full-stack application** (React + FastAPI)  
✅ **Real database integration** (Google Sheets)  
✅ Data coherence across all modules  
✅ **Production-ready backend** with clean architecture  
✅ **Enhanced Invoice Generator** with 4 major improvements  
✅ Professional charts and visualizations  
✅ Responsive design (desktop-optimized)  
✅ Clean, maintainable codebase  

## 🔗 API Documentation

Once backend is running, access interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/invoices` | Create new invoice |
| GET | `/api/v1/invoices` | List all invoices (with filters) |
| GET | `/api/v1/invoices/{id}` | Get specific invoice |
| PATCH | `/api/v1/invoices/{id}/status` | Update invoice status |

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (frontend + backend)
5. Write/update tests if applicable
6. Submit a pull request

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Built with ❤️ by the N Company Team**

*Last Updated: January 23, 2026*

**Changelog:**
- **Jan 23, 2026**: Phase 3 & 4 complete - Backend integration + Enhanced Invoice Generator
- **Jan 22, 2026**: Phase 2 complete - Data coherence and interconnections
- **Jan 21, 2026**: Phase 1 complete - All 8 modules with premium UI
