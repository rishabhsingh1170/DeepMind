"""
Document Routes
Endpoints for document viewing: list documents.
Document creation and upload now only happen via /chats/create endpoint.
"""

from fastapi import APIRouter, status

try:
    from backend.models.document_schema import DocumentResponse
    from backend.controller.document_controller import list_documents_logic
except ModuleNotFoundError:
    from models.document_schema import DocumentResponse
    from controller.document_controller import list_documents_logic

# Create APIRouter for document endpoints
router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/", response_model=list[DocumentResponse])
def list_documents():
    """
    Fetch all documents.
    
    Returns:
        List of all documents
    """
    return list_documents_logic()
