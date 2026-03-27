"""
User Routes
Endpoints for user operations: create, list, profile image upload.
"""

from fastapi import APIRouter, status, UploadFile, File

try:
    from backend.models.user_schema import UserCreate, UserResponse
    from backend.controller.user_controller import create_user_logic, list_users_logic, upload_user_profile_image, assign_user_to_company
except ModuleNotFoundError:
    from models.user_schema import UserCreate, UserResponse
    from controller.user_controller import create_user_logic, list_users_logic, upload_user_profile_image, assign_user_to_company

# Create APIRouter for user endpoints
router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate):
    """
    Create a new user with secure password hashing.
    Validates email uniqueness and company existence.
    
    Args:
        payload: User creation data (name, email, password, profile_url, company_id, role)
        
    Returns:
        Created user with _id (password excluded)
        
    Raises:
        409: Email already registered
        404: Company not found
    """
    return create_user_logic(payload)


@router.get("/", response_model=list[UserResponse])
def list_users():
    """
    Fetch all users (password_hash excluded).
    
    Returns:
        List of all users
    """
    return list_users_logic()


@router.post("/{user_id}/profile-image", response_model=UserResponse)
def upload_profile_image_endpoint(user_id: str, file: UploadFile = File(...)):
    """
    Upload and update user profile image.
    Stores image in Cloudinary and updates user record with image URL.
    
    Args:
        user_id: User ObjectId as string
        file: Image file (JPEG, PNG, WebP, GIF)
        
    Returns:
        Updated user with profile_url
        
    Raises:
        404: User not found
        400: Invalid user ID or file format
        500: Upload failed
    """
    return upload_user_profile_image(user_id, file)


@router.post("/{user_id}/assign-company/{company_id}", response_model=UserResponse)
def assign_user_to_company_endpoint(user_id: str, company_id: str):
    """
    Admin endpoint to assign a user to a company after signup.
    This grants the user access to the chatbot for that company.
    
    Args:
        user_id: User ObjectId as string
        company_id: Company ObjectId as string
        
    Returns:
        Updated user with company_id
        
    Raises:
        404: User or company not found
        400: Invalid ID format
    """
    return assign_user_to_company(user_id, company_id)
