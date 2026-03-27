"""
Company Routes
Endpoints for company operations: create, list.
"""

from fastapi import APIRouter, status

try:
    from backend.models.company_schema import CompanyCreate, CompanyResponse
    from backend.controller.company_controller import create_company_logic, list_companies_logic
except ModuleNotFoundError:
    from models.company_schema import CompanyCreate, CompanyResponse
    from controller.company_controller import create_company_logic, list_companies_logic

# Create APIRouter for company endpoints
router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate):
    """
    Create a new company.
    
    Args:
        payload: Company creation data (company_name)
        
    Returns:
        Created company with _id
    """
    return create_company_logic(payload)


@router.get("/", response_model=list[CompanyResponse])
def list_companies():
    """
    Fetch all companies.
    
    Returns:
        List of all companies
    """
    return list_companies_logic()
