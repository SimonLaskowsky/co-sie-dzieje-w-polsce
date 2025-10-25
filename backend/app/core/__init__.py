"""Core modules for the application."""

from .config import (
    BASIC_URL,
    API_URL,
    VOTING_URL,
    DATABASE_URL,
    OPENAI_API_KEY,
    CURRENT_YEAR,
    LAST_KNOWN_FILE,
    ACT_CONTENT_FILE,
    ELI_FOR_LATER,
    ACT_ANALYSIS_FILE,
    MAX_ACTS_TO_PROCESS,
    PDF_DOWNLOAD_TIMEOUT,
    check_environment,
)
from .logging import get_logger, setup_logger
from .exceptions import (
    BackendException,
    DatabaseError,
    ExternalAPIError,
    AIServiceError,
    ValidationError,
    PDFProcessingError,
    FileOperationError,
)

__all__ = [
    # Config
    "BASIC_URL",
    "API_URL",
    "VOTING_URL",
    "DATABASE_URL",
    "OPENAI_API_KEY",
    "CURRENT_YEAR",
    "LAST_KNOWN_FILE",
    "ACT_CONTENT_FILE",
    "ELI_FOR_LATER",
    "ACT_ANALYSIS_FILE",
    "MAX_ACTS_TO_PROCESS",
    "PDF_DOWNLOAD_TIMEOUT",
    "check_environment",
    # Logging
    "get_logger",
    "setup_logger",
    # Exceptions
    "BackendException",
    "DatabaseError",
    "ExternalAPIError",
    "AIServiceError",
    "ValidationError",
    "PDFProcessingError",
    "FileOperationError",
]
