"""
Document Routes
Endpoints for document operations: create, list, upload.
"""

from fastapi import APIRouter, status, UploadFile, File, Form

try:
    from backend.models.document_schema import DocumentCreate, DocumentResponse
    from backend.controller.document_controller import create_document_logic, list_documents_logic, upload_document_file
except ModuleNotFoundError:
    from models.document_schema import DocumentCreate, DocumentResponse
    from controller.document_controller import create_document_logic, list_documents_logic, upload_document_file

# Create APIRouter for document endpoints
router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def create_document(payload: DocumentCreate):
    """
    Create a new document.
    Validates company and uploader user exist.
    
    Args:
        payload: Document creation data (document_name, company_id, uploaded_by, document_url)
        
    Returns:
        Created document with _id
        
    Raises:
        404: Company not found or uploader not found
    """
    return create_document_logic(payload)


@router.get("/", response_model=list[DocumentResponse])
def list_documents():
    """
    Fetch all documents.
    
    Returns:
        List of all documents
    """
    return list_documents_logic()


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document_endpoint(
    company_id: str = Form(...),
    uploaded_by: str = Form(...),
    document_name: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload a document file to Cloudinary and create document record.
    Supports PDF, DOCX, XLSX, PPTX, TXT and other common document formats.
    
    Args:
        company_id: Company ObjectId as string
        uploaded_by: User ObjectId as string (uploader)
        document_name: Name of the document
        file: Document file to upload
        
    Returns:
        Created document with Cloudinary URL
        
    Raises:
        404: Company or user not found
        400: Invalid IDs or file format
        500: Upload failed
    """
    return upload_document_file(company_id, uploaded_by, document_name, file)
