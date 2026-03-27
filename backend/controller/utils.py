"""
Utility functions for controllers.
Contains common helpers for serialization, password hashing, and verification.
"""

import bcrypt
from typing import Any


def serialize_id(document: dict) -> dict:
    """
    Normalize ObjectId to string for API JSON responses.
    
    Args:
        document: MongoDB document with _id field
        
    Returns:
        Document with string _id
    """
    if document and "_id" in document:
        document["_id"] = str(document["_id"])
    return document


def hash_password(password: str) -> str:
    """
    Hash password with bcrypt salt.
    Stores salted hash, never plain-text passwords.
    
    Args:
        password: Plain-text password from user
        
    Returns:
        Salted bcrypt hash
    """
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """
    Verify plain-text password against stored bcrypt hash.
    
    Args:
        password: Plain-text password to verify
        password_hash: Stored bcrypt hash
        
    Returns:
        True if password matches hash, False otherwise
    """
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
