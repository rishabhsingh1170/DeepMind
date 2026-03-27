"""
Company Controller
Handles all company-related business logic: create, list operations.
"""

from bson import ObjectId
from fastapi import HTTPException, status

try:
    from backend.database.mongo import companies_collection
    from backend.models.company_schema import CompanyCreate, CompanyResponse
except ModuleNotFoundError:
    from database.mongo import companies_collection
    from models.company_schema import CompanyCreate, CompanyResponse

from .utils import serialize_id


def create_company_logic(payload: CompanyCreate) -> dict:
    """
    Create a new company in database.
    
    Args:
        payload: Company creation data
        
    Returns:
        Created company with generated _id
    """
    created = payload.model_dump()
    result = companies_collection.insert_one(created)
    created["_id"] = str(result.inserted_id)
    return created


def list_companies_logic() -> list[dict]:
    """
    Fetch all companies from database.
    
    Returns:
        List of all companies with serialized _id
    """
    companies = companies_collection.find()
    return [serialize_id(company) for company in companies]


def get_company_by_id(company_id: str):
    """
    Fetch single company by ObjectId.
    
    Args:
        company_id: Company ObjectId as string
        
    Returns:
        Company document or raises 404
    """
    try:
        company = companies_collection.find_one({"_id": ObjectId(company_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return serialize_id(company)
