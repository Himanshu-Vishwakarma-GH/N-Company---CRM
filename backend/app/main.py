"""
N Company CRM - FastAPI Backend
Main application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.routers import invoice, client, dashboard, task, search, ticket, activity

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Production-ready CRM backend with Google Sheets integration",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    invoice.router,
    prefix=settings.api_prefix
)
app.include_router(
    client.router,
    prefix=settings.api_prefix
)
app.include_router(
    dashboard.router,
    prefix=settings.api_prefix
)
app.include_router(
    task.router,
    prefix=settings.api_prefix
)
app.include_router(
    search.router,
    prefix=settings.api_prefix
)
app.include_router(
    ticket.router
)
app.include_router(
    activity.router
)

@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "N Company CRM API",
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "environment": settings.environment
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development"
    )
