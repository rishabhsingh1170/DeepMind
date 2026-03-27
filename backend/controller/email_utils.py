"""
Email Utilities
Handles email sending functionality using SMTP.
"""

import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone

try:
    from backend.config import SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SENDER_EMAIL, OTP_EXPIRATION_MINUTES
    from backend.database.mongo import otp_collection
except ModuleNotFoundError:
    from config import SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SENDER_EMAIL, OTP_EXPIRATION_MINUTES
    from database.mongo import otp_collection


def generate_otp() -> str:
    """
    Generate a 6-digit random OTP.
    
    Returns:
        6-digit OTP as string
    """
    return ''.join([str(secrets.randbelow(10)) for _ in range(6)])


def send_otp_email(email: str) -> dict:
    """
    Generate OTP, store in database, and send via email.
    
    Args:
        email: Recipient email address
        
    Returns:
        Dict with message and expiration time
        
    Raises:
        Exception: If email sending fails
    """
    # Generate OTP
    otp = generate_otp()
    
    # Calculate expiration
    now = datetime.now(timezone.utc)
    expiration_time = now + timedelta(minutes=OTP_EXPIRATION_MINUTES)
    
    # Store OTP in database
    otp_collection.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "otp": otp,
                "created_at": now,
                "expires_at": expiration_time
            }
        },
        upsert=True
    )
    
    # Send email
    try:
        # Create message
        subject = "Email Verification - Your OTP Code"
        
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
                    <h2 style="color: #333;">Email Verification Required</h2>
                    <p>Welcome to DocMind! Please verify your email by entering the OTP below:</p>
                    
                    <div style="background-color: #fff; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <p style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">
                            {otp}
                        </p>
                    </div>
                    
                    <p style="color: #666;">This code will expire in {OTP_EXPIRATION_MINUTES} minutes.</p>
                    
                    <p style="color: #999; font-size: 12px;">
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                </div>
            </body>
        </html>
        """
        
        # Create MIME message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = SENDER_EMAIL
        message["To"] = email
        
        # Attach HTML content
        message.attach(MIMEText(html_body, "html"))
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SENDER_EMAIL, email, message.as_string())
        
        return {
            "message": f"OTP sent to {email}",
            "expiration_minutes": OTP_EXPIRATION_MINUTES
        }
        
    except smtplib.SMTPException as e:
        raise Exception(f"Failed to send email: {str(e)}")
    except Exception as e:
        raise Exception(f"Email error: {str(e)}")


def verify_otp(email: str, otp: str) -> dict:
    """
    Verify OTP against stored value in database.
    
    Args:
        email: User email
        otp: OTP code to verify
        
    Returns:
        Dict with verification status
        
    Raises:
        Exception: If OTP is invalid or expired
    """
    # Find OTP record
    otp_record = otp_collection.find_one({"email": email})
    
    if not otp_record:
        raise Exception("No OTP found for this email. Please request a new one.")
    
    # Check if expired. Mongo can return naive datetimes; normalize to UTC-aware.
    now = datetime.now(timezone.utc)
    expires_at = otp_record["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now > expires_at:
        otp_collection.delete_one({"email": email})
        raise Exception("OTP has expired. Please request a new one.")
    
    # Check if OTP matches
    if otp_record["otp"] != otp:
        raise Exception("Invalid OTP. Please try again.")
    
    # OTP verified - delete the record
    otp_collection.delete_one({"email": email})
    
    return {
        "message": "OTP verified successfully",
        "email": email,
        "verified": True
    }
