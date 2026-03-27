"""
User Controller
Handles all user-related business logic: create, list, validation operations.
"""

from bson import ObjectId
from fastapi import HTTPException, status, UploadFile

try:
    from backend.database.mongo import users_collection, companies_collection
    from backend.models.user_schema import UserCreate, UserResponse
    from backend.controller.cloudinary_utils import upload_profile_image
except ModuleNotFoundError:
    from database.mongo import users_collection, companies_collection
    from models.user_schema import UserCreate, UserResponse
    from controller.cloudinary_utils import upload_profile_image

from .utils import serialize_id, hash_password


def create_user_logic(payload: UserCreate) -> dict:
    """
    Create a new user in database with password hashing.
    Validates email uniqueness. Company assignment is done by admin later.
    
    Args:
        payload: User creation data (company_id is optional)
        
    Returns:
        Created user with generated _id (password_hash included, password excluded)
        
    Raises:
        HTTPException: If email exists (409)
    """
    # Check email uniqueness
    existing_user = users_collection.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")

    # mode="json" converts HttpUrl/EmailStr/Enum to plain serializable values (BSON-safe).
    created = payload.model_dump(mode="json", exclude={"password"})
    created["password_hash"] = hash_password(payload.password)

    result = users_collection.insert_one(created)
    created["_id"] = str(result.inserted_id)
    return created


def list_users_logic() -> list[dict]:
    """
    Fetch all users from database (excluding password_hash).
    
    Returns:
        List of all users with serialized _id
    """
    users = users_collection.find()
    response = []
    for user in users:
        user["_id"] = str(user["_id"])
        response.append(
            {
                "_id": user["_id"],
                "name": user["name"],
                "role": user["role"],
                "profile_url": user.get("profile_url"),
                "email": user["email"],
                "company_id": user.get("company_id"),  # May be None
            }
        )
    return response


def get_user_by_id(user_id: str) -> dict:
    """
    Fetch single user by ObjectId (excluding password_hash).
    
    Args:
        user_id: User ObjectId as string
        
    Returns:
        User document or raises 404
    """
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["_id"] = str(user["_id"])
    return {
        "_id": user["_id"],
        "name": user["name"],
        "role": user["role"],
        "profile_url": user.get("profile_url"),
        "email": user["email"],
        "company_id": user.get("company_id"),  # May be None
    }


def upload_user_profile_image(user_id: str, file: UploadFile) -> dict:
    """
    Upload profile image for a user to Cloudinary and update user record.
    
    Args:
        user_id: User ObjectId as string
        file: Image file from upload
        
    Returns:
        Updated user document with profile_url
        
    Raises:
        HTTPException: If user not found or upload fails
    """
    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    user = users_collection.find_one({"_id": user_obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Upload image to Cloudinary
    profile_url = upload_profile_image(file)
    
    # Update user with new profile URL
    users_collection.update_one(
        {"_id": user_obj_id},
        {"$set": {"profile_url": profile_url}}
    )
    
    # Return updated user
    user["profile_url"] = profile_url
    user["_id"] = str(user["_id"])
    return {
        "_id": user["_id"],
        "name": user["name"],
        "role": user["role"],
        "profile_url": user["profile_url"],
        "email": user["email"],
        "company_id": user.get("company_id"),  # May be None
    }


def assign_user_to_company(user_id: str, company_id: str) -> dict:
    """
    Admin function to assign a user to a company after signup.
    This grants the user access to the chatbot for that company.
    
    Args:
        user_id: User ObjectId as string
        company_id: Company ObjectId as string
        
    Returns:
        Updated user document
        
    Raises:
        HTTPException: If user/company not found or invalid ID format
    """
    # Validate user exists
    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    user = users_collection.find_one({"_id": user_obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate company exists
    try:
        company_obj_id = ObjectId(company_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    
    company = companies_collection.find_one({"_id": company_obj_id})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Assign company to user
    users_collection.update_one(
        {"_id": user_obj_id},
        {"$set": {"company_id": str(company_obj_id)}}
    )
    
    # Return updated user
    updated_user = users_collection.find_one({"_id": user_obj_id})
    updated_user["_id"] = str(updated_user["_id"])
    return {
        "_id": updated_user["_id"],
        "name": updated_user["name"],
        "role": updated_user["role"],
        "email": updated_user["email"],
        "profile_url": updated_user.get("profile_url"),
        "company_id": updated_user.get("company_id"),
    }
