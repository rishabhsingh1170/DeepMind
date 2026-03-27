"""
OTP Schema
Handles OTP data validation and serialization for email verification.
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime


class OTPCreate(BaseModel):
    """Request to send OTP to email."""
    email: EmailStr


class OTPVerify(BaseModel):
    """Request to verify OTP."""
    email: EmailStr
    otp: str


class OTPResponse(BaseModel):
    """Response after OTP sent."""
    message: str
    email: str
    expires_in: int  # seconds
