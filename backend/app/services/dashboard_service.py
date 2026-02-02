"""
Dashboard service for aggregating metrics from Google Sheets.
"""
from typing import List, Dict, Optional
from datetime import datetime, date, timedelta
from decimal import Decimal
from collections import defaultdict
from app.services.sheets_service import SheetsService
from app.services.invoice_service import InvoiceService
from app.services.client_service import ClientService


class DashboardService:
    """Service for dashboard metrics and aggregations."""
    
    def __init__(self, sheets: SheetsService):
        self.sheets = sheets
        self.invoice_service = InvoiceService(sheets)
        self.client_service = ClientService(sheets)
    
    def _parse_date(self, date_str: str) -> Optional[date]:
        """Safely parse date string."""
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str).date()
        except (ValueError, TypeError):
            return None
    
    def _filter_by_date_range(
        self, 
        items: List[Dict], 
        date_field: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> List[Dict]:
        """Filter items by date range."""
        if not start_date and not end_date:
            return items
        
        start = self._parse_date(start_date) if start_date else None
        end = self._parse_date(end_date) if end_date else None
        
        filtered = []
        for item in items:
            item_date = self._parse_date(item.get(date_field, ''))
            if not item_date:
                continue
            
            if start and item_date < start:
                continue
            if end and item_date > end:
                continue
            
            filtered.append(item)
        
        return filtered
    
    def _safe_decimal(self, value, default=0.0) -> Decimal:
        """Safely convert value to Decimal."""
        try:
            if value is None or value == '':
                return Decimal(str(default))
            return Decimal(str(value))
        except (ValueError, TypeError):
            return Decimal(str(default))
    
    def get_executive_metrics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict:
        """
        Get executive dashboard metrics.
        
        Returns:
            - total_revenue
            - total_invoices
            - active_clients
            - revenue_growth
            - invoice_growth
            - client_growth
            - monthly_revenue
            - top_clients
        """
        # Get all invoices
        invoices = self.sheets.get_all_rows("Invoices")
        clients = self.sheets.get_all_rows("Clients")
        
        # Filter by date range
        filtered_invoices = self._filter_by_date_range(
            invoices, 
            "invoice_date",
            start_date,
            end_date
        )
        
        # Calculate total revenue
        total_revenue = sum(
            self._safe_decimal(inv.get('grand_total', 0))
            for inv in filtered_invoices
        )
        
        # Total invoices
        total_invoices = len(filtered_invoices)
        
        # Active clients (clients with invoices in period)
        active_client_ids = set(
            inv.get('client_id') 
            for inv in filtered_invoices 
            if inv.get('client_id')
        )
        active_clients = len(active_client_ids)
        
        # Calculate growth (compare to previous period)
        if start_date and end_date:
            start = self._parse_date(start_date)
            end = self._parse_date(end_date)
            if start and end:
                period_days = (end - start).days
                prev_start = start - timedelta(days=period_days)
                prev_end = start - timedelta(days=1)
                
                prev_invoices = self._filter_by_date_range(
                    invoices,
                    "invoice_date",
                    prev_start.isoformat(),
                    prev_end.isoformat()
                )
                
                prev_revenue = sum(
                    self._safe_decimal(inv.get('grand_total', 0))
                    for inv in prev_invoices
                )
                
                revenue_growth = (
                    ((total_revenue - prev_revenue) / prev_revenue * 100)
                    if prev_revenue > 0 else 0
                )
                
                invoice_growth = (
                    ((total_invoices - len(prev_invoices)) / len(prev_invoices) * 100)
                    if len(prev_invoices) > 0 else 0
                )
            else:
                revenue_growth = 0
                invoice_growth = 0
        else:
            revenue_growth = 0
            invoice_growth = 0
        
        # Monthly revenue trend
        monthly_data = defaultdict(Decimal)
        for inv in filtered_invoices:
            inv_date = self._parse_date(inv.get('invoice_date'))
            if inv_date:
                month_key = inv_date.strftime('%Y-%m')
                monthly_data[month_key] += self._safe_decimal(inv.get('grand_total', 0))
        
        monthly_revenue = [
            {
                "month": datetime.strptime(month, '%Y-%m').strftime('%b %Y'),
                "revenue": float(revenue)
            }
            for month, revenue in sorted(monthly_data.items())
        ]
        
        # Top clients by revenue
        client_revenue = defaultdict(Decimal)
        client_names = {}
        
        for inv in filtered_invoices:
            client_id = inv.get('client_id')
            if client_id:
                client_revenue[client_id] += self._safe_decimal(inv.get('grand_total', 0))
                # Store client name
                if client_id not in client_names:
                    client_names[client_id] = inv.get('client_name', client_id)
        
        top_clients = [
            {
                "name": client_names.get(client_id, client_id),
                "revenue": float(revenue)
            }
            for client_id, revenue in sorted(
                client_revenue.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]  # Top 5 clients
        ]
        
        return {
            "total_revenue": float(total_revenue),
            "total_invoices": total_invoices,
            "active_clients": active_clients,
            "revenue_growth": float(revenue_growth),
            "invoice_growth": float(invoice_growth),
            "client_growth": 0,  # Will calculate when we have date tracking
            "monthly_revenue": monthly_revenue,
            "top_clients": top_clients
        }
    
    def get_sales_metrics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict:
        """
        Get sales dashboard metrics.
        
        Returns:
            - total_sales
            - invoices_count
            - avg_invoice_value
            - sales_trend
            - top_salespeople
            - conversion_rate (placeholder)
        """
        # Get all invoices
        invoices = self.sheets.get_all_rows("Invoices")
        
        # Filter by date range
        filtered_invoices = self._filter_by_date_range(
            invoices,
            "invoice_date",
            start_date,
            end_date
        )
        
        # Total sales
        total_sales = sum(
            self._safe_decimal(inv.get('grand_total', 0))
            for inv in filtered_invoices
        )
        
        invoices_count = len(filtered_invoices)
        
        # Average invoice value
        avg_invoice_value = (
            float(total_sales / invoices_count)
            if invoices_count > 0 else 0
        )
        
        # Sales trend by day
        daily_sales = defaultdict(Decimal)
        for inv in filtered_invoices:
            inv_date = self._parse_date(inv.get('invoice_date'))
            if inv_date:
                daily_sales[inv_date.isoformat()] += self._safe_decimal(inv.get('grand_total', 0))
        
        sales_trend = [
            {
                "date": date_str,
                "sales": float(sales)
            }
            for date_str, sales in sorted(daily_sales.items())
        ]
        
        # Top salespeople
        salesperson_data = defaultdict(lambda: {"sales": Decimal(0), "count": 0})
        
        for inv in filtered_invoices:
            salesperson = inv.get('sales_person', 'Unknown')
            salesperson_data[salesperson]["sales"] += self._safe_decimal(inv.get('grand_total', 0))
            salesperson_data[salesperson]["count"] += 1
        
        top_salespeople = [
            {
                "name": person,
                "sales": float(data["sales"]),
                "invoices": data["count"]
            }
            for person, data in sorted(
                salesperson_data.items(),
                key=lambda x: x[1]["sales"],
                reverse=True
            )[:10]  # Top 10 salespeople
        ]
        
        return {
            "total_sales": float(total_sales),
            "invoices_count": invoices_count,
            "avg_invoice_value": avg_invoice_value,
            "sales_trend": sales_trend,
            "top_salespeople": top_salespeople,
            "conversion_rate": 65.5  # Placeholder - need leads data
        }
    
    def get_financial_metrics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict:
        """
        Get financial dashboard metrics.
        
        Returns:
            - total_revenue
            - total_tax
            - total_discount
            - net_revenue
            - revenue_by_month
            - payment_status breakdown
        """
        # Get all invoices
        invoices = self.sheets.get_all_rows("Invoices")
        
        # Filter by date range
        filtered_invoices = self._filter_by_date_range(
            invoices,
            "invoice_date",
            start_date,
            end_date
        )
        
        # Totals
        total_revenue = Decimal(0)
        total_tax = Decimal(0)
        total_discount = Decimal(0)
        
        # Payment status breakdown
        payment_status = {
            "paid": Decimal(0),
            "pending": Decimal(0),
            "overdue": Decimal(0),
            "draft": Decimal(0)
        }
        
        for inv in filtered_invoices:
            grand_total = self._safe_decimal(inv.get('grand_total', 0))
            total_revenue += grand_total
            total_tax += self._safe_decimal(inv.get('total_tax', 0))
            total_discount += self._safe_decimal(inv.get('total_discount', 0))
            
            # Status breakdown
            status = inv.get('status', 'draft').lower()
            if status in payment_status:
                payment_status[status] += grand_total
        
        # Net revenue (after tax and discount)
        net_revenue = total_revenue - total_tax - total_discount
        
        # Revenue by month
        monthly_revenue = defaultdict(Decimal)
        for inv in filtered_invoices:
            inv_date = self._parse_date(inv.get('invoice_date'))
            if inv_date:
                month_key = inv_date.strftime('%Y-%m')
                monthly_revenue[month_key] += self._safe_decimal(inv.get('grand_total', 0))
        
        revenue_by_month = [
            {
                "month": datetime.strptime(month, '%Y-%m').strftime('%b %Y'),
                "revenue": float(revenue)
            }
            for month, revenue in sorted(monthly_revenue.items())
        ]
        
        return {
            "total_revenue": float(total_revenue),
            "total_tax": float(total_tax),
            "total_discount": float(total_discount),
            "net_revenue": float(net_revenue),
            "revenue_by_month": revenue_by_month,
            "payment_status": {
                status: float(amount)
                for status, amount in payment_status.items()
            }
        }
