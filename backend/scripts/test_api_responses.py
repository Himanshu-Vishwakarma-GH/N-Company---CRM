"""
Test API responses to see exact data structures
"""
import requests
import json

API_KEY = "dev-api-key-12345"
BASE_URL = "http://localhost:8000/api/v1"

headers = {"X-API-Key": API_KEY}

print("=== TESTING CLIENT API ===")
clients_response = requests.get(f"{BASE_URL}/clients", headers=headers)
print(f"Status: {clients_response.status_code}")
clients_data = clients_response.json()
print(f"Response keys: {clients_data.keys()}")
print(f"Client count: {len(clients_data.get('data', []))}")
if clients_data.get('data'):
    print("\nFirst 2 clients:")
    for i, client in enumerate(clients_data['data'][:2], 1):
        print(f"{i}. ID: {client.get('client_id')} | Name: {client.get('name')}")

print("\n=== TESTING INVOICE API ===")
invoices_response = requests.get(f"{BASE_URL}/invoices", headers=headers)
print(f"Status: {invoices_response.status_code}")
invoices_data = invoices_response.json()
print(f"Response keys: {invoices_data.keys()}")
print(f"Invoice count: {len(invoices_data.get('data', []))}")
if invoices_data.get('data'):
    print("\nFirst 2 invoices:")
    for i, inv in enumerate(invoices_data['data'][:2], 1):
        print(f"{i}. ID: {inv.get('invoice_id')} | ClientID: {inv.get('client_id')} | Total: ₹{inv.get('grand_total')}")

print("\n=== CLIENT-INVOICE MATCHING TEST ===")
clients_list = clients_data.get('data', [])
invoices_list = invoices_data.get('data', [])

# Create client mapping
clients = {}
for c in clients_list:
    clients[c['client_id']] = c['name']

for inv in invoices_list:
    inv_id = inv.get('invoice_id')
    client_id = inv.get('client_id')
    client_name = clients.get(client_id, 'NOT FOUND')
    status = "✅ MATCH" if client_name != 'NOT FOUND' else "❌ NO MATCH"
    print(f"{status} Invoice: {inv_id} | ClientID: {client_id} | Client: {client_name}")
