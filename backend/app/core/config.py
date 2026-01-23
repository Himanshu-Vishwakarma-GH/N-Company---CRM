"""
Configuration management for N Company CRM Backend.
Loads environment variables and provides application settings.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Google Sheets Configuration
    google_sheets_credentials_path: str
    spreadsheet_id: str
    
    # API Configuration
    api_key: str
    environment: str = "development"
    
    # CORS Configuration
    frontend_url: str
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    
    # API Metadata
    app_name: str = "N Company CRM API"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
