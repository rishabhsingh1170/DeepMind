"""
Chat Controller
Handles all chat-related business logic: create, list, and admin-specific operations.
Each admin can only have ONE chat assigned to ONE company.
"""

import secrets
from bson import ObjectId
from fastapi import HTTPException, UploadFile
from datetime import datetime

try:
    from backend.database.mongo import (
        chats_collection,
        documents_collection,
        companies_collection,
        users_collection,
        chat_access_requests_collection,
        chat_access_collection,
    )
    from backend.controller.cloudinary_utils import upload_document
except ModuleNotFoundError:
    from database.mongo import (
        chats_collection,
        documents_collection,
        companies_collection,
        users_collection,
        chat_access_requests_collection,
        chat_access_collection,
    )
    from controller.cloudinary_utils import upload_document

from .utils import serialize_id


def _get_user_or_404(user_id: str) -> dict:
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    user = users_collection.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _assert_role(user: dict, role: str) -> None:
    if user.get("role") != role:
        raise HTTPException(status_code=403, detail=f"Only {role}s can perform this action")


def _generate_chat_token() -> str:
    # URL-safe token that admins can share with employees.
    return secrets.token_urlsafe(24)


def _hide_chat_token(chat: dict) -> dict:
    chat_data = serialize_id(chat)
    chat_data.pop("chat_token", None)
    return chat_data


def create_chat_logic(
    admin_id: str,
    company_name: str,
    document_name: str,
    file: UploadFile
) -> dict:
    """
    Create a chat for an admin with company details and document upload.
    Admin can only have ONE chat in the system.
    
    Args:
        admin_id: Admin user ObjectId as string
        company_name: Name of the company for this chat
        document_name: Name of the document to upload
        file: Document file from upload
        
    Returns:
        Created chat with embedded company and document details
        
    Raises:
        HTTPException: If validation fails or upload fails
    """
    admin_user = _get_user_or_404(admin_id)
    _assert_role(admin_user, "admin")
    
    # Check if admin already has a chat (one-per-admin constraint)
    existing_chat = chats_collection.find_one({"admin_id": admin_id})
    if existing_chat:
        raise HTTPException(
            status_code=409, 
            detail="Admin already has a chat. Only one chat per admin is allowed."
        )
    
    # Create or get company
    # First check if company with this name already exists
    company = companies_collection.find_one({"company_name": company_name})
    if not company:
        # Create new company
        company_data = {
            "company_name": company_name,
            "created_by": admin_id
        }
        company_result = companies_collection.insert_one(company_data)
        company_id = str(company_result.inserted_id)
    else:
        company_id = str(company["_id"])
    
    # Upload document to Cloudinary
    document_url = upload_document(file)
    
    # Create document record in database
    document_record = {
        "document_name": document_name,
        "company_id": company_id,
        "uploaded_by": admin_id,
        "document_url": document_url,
        "created_at": datetime.utcnow()
    }
    
    document_result = documents_collection.insert_one(document_record)
    document_id = str(document_result.inserted_id)
    
    # Create chat record
    now = datetime.utcnow()
    chat_record = {
        "admin_id": admin_id,
        "company_id": company_id,
        "document_id": document_id,
        "chat_token": _generate_chat_token(),
        "created_at": now,
        "updated_at": now
    }
    
    result = chats_collection.insert_one(chat_record)
    chat_record["_id"] = str(result.inserted_id)
    
    return chat_record


def list_chats_logic() -> list[dict]:
    """
    Fetch all chats from database.
    
    Returns:
        List of all chats with serialized _id
    """
    chats = chats_collection.find()
    return [serialize_id(chat) for chat in chats]


def list_chats_for_user_logic(user_id: str, role: str) -> list[dict]:
    """
    List chats accessible to the current user.
    Admin sees their own chat. Employee sees approved chats.
    """
    if role == "admin":
        chats = chats_collection.find({"admin_id": user_id})
        return [_hide_chat_token(chat) for chat in chats]

    if role == "employee":
        access_records = chat_access_collection.find({"employee_id": user_id})
        chat_ids = [record.get("chat_id") for record in access_records]
        if not chat_ids:
            return []
        chats = chats_collection.find({"_id": {"$in": [ObjectId(chat_id) for chat_id in chat_ids]}})
        return [_hide_chat_token(chat) for chat in chats]

    raise HTTPException(status_code=403, detail="Unsupported user role")


def get_chat_by_id(chat_id: str) -> dict:
    """
    Fetch single chat by ObjectId.
    
    Args:
        chat_id: Chat ObjectId as string
        
    Returns:
        Chat document or raises 404
    """
    try:
        chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid chat ID format")
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    return serialize_id(chat)


def can_user_access_chat_logic(chat_id: str, user_id: str, role: str) -> bool:
    """
    Check whether user can access a chat.
    """
    chat = get_chat_by_id(chat_id)

    if role == "admin":
        return chat.get("admin_id") == user_id

    if role == "employee":
        access = chat_access_collection.find_one({"chat_id": chat_id, "employee_id": user_id})
        return access is not None

    return False


def get_chat_by_admin_id(admin_id: str) -> dict:
    """
    Fetch admin's chat (admin can only have one).
    
    Args:
        admin_id: Admin user ObjectId as string
        
    Returns:
        Chat document or raises 404
    """
    chat = chats_collection.find_one({"admin_id": admin_id})
    
    if not chat:
        raise HTTPException(status_code=404, detail="No chat found for this admin")
    
    return serialize_id(chat)


def get_chat_token_by_admin_id(admin_id: str) -> dict:
    """
    Return chat token for the admin's chat.
    """
    chat = get_chat_by_admin_id(admin_id)
    return {"chat_id": chat["_id"], "chat_token": chat["chat_token"]}


def request_chat_access_logic(employee_id: str, chat_token: str) -> dict:
    """
    Employee requests access to a chat by shared chat token.
    """
    employee_user = _get_user_or_404(employee_id)
    _assert_role(employee_user, "employee")

    chat = chats_collection.find_one({"chat_token": chat_token})
    if not chat:
        raise HTTPException(status_code=404, detail="Invalid chat token")

    chat_id = str(chat["_id"])
    admin_id = chat["admin_id"]

    already_granted = chat_access_collection.find_one({"chat_id": chat_id, "employee_id": employee_id})
    if already_granted:
        raise HTTPException(status_code=409, detail="Access already granted for this chat")

    now = datetime.utcnow()
    existing_request = chat_access_requests_collection.find_one(
        {"chat_id": chat_id, "employee_id": employee_id}
    )

    if existing_request and existing_request.get("status") == "pending":
        raise HTTPException(status_code=409, detail="Access request is already pending")

    if existing_request:
        chat_access_requests_collection.update_one(
            {"_id": existing_request["_id"]},
            {
                "$set": {
                    "status": "pending",
                    "requested_at": now,
                    "reviewed_at": None,
                    "reviewed_by": None,
                }
            },
        )
        refreshed = chat_access_requests_collection.find_one({"_id": existing_request["_id"]})
        return serialize_id(refreshed)

    request_doc = {
        "chat_id": chat_id,
        "admin_id": admin_id,
        "employee_id": employee_id,
        "status": "pending",
        "requested_at": now,
        "reviewed_at": None,
        "reviewed_by": None,
    }
    result = chat_access_requests_collection.insert_one(request_doc)
    request_doc["_id"] = str(result.inserted_id)
    return request_doc


def list_access_requests_for_admin_logic(admin_id: str, status_filter: str | None = "pending") -> list[dict]:
    """
    List chat access requests for an admin.
    """
    admin_user = _get_user_or_404(admin_id)
    _assert_role(admin_user, "admin")

    query = {"admin_id": admin_id}
    if status_filter:
        query["status"] = status_filter

    requests = chat_access_requests_collection.find(query).sort("requested_at", -1)
    return [serialize_id(request) for request in requests]


def review_access_request_logic(admin_id: str, request_id: str, action: str) -> dict:
    """
    Admin approves or denies employee chat access request.
    """
    admin_user = _get_user_or_404(admin_id)
    _assert_role(admin_user, "admin")

    try:
        request_obj_id = ObjectId(request_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID format")

    access_request = chat_access_requests_collection.find_one({"_id": request_obj_id})
    if not access_request:
        raise HTTPException(status_code=404, detail="Access request not found")

    if access_request.get("admin_id") != admin_id:
        raise HTTPException(status_code=403, detail="You can only review requests for your own chat")

    if access_request.get("status") != "pending":
        raise HTTPException(status_code=409, detail="Only pending requests can be reviewed")

    now = datetime.utcnow()
    if action == "approve":
        chat_access_collection.update_one(
            {"chat_id": access_request["chat_id"], "employee_id": access_request["employee_id"]},
            {
                "$set": {
                    "chat_id": access_request["chat_id"],
                    "employee_id": access_request["employee_id"],
                    "admin_id": admin_id,
                    "granted_at": now,
                }
            },
            upsert=True,
        )
        new_status = "approved"
    elif action == "deny":
        new_status = "denied"
    else:
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'deny'")

    chat_access_requests_collection.update_one(
        {"_id": request_obj_id},
        {
            "$set": {
                "status": new_status,
                "reviewed_at": now,
                "reviewed_by": admin_id,
            }
        },
    )

    updated = chat_access_requests_collection.find_one({"_id": request_obj_id})
    return serialize_id(updated)
