"""
Cloudinary utility functions for file upload and management.
Handles image uploads for profiles and document uploads.
"""

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException

try:
    from backend.config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
except ModuleNotFoundError:
    from config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET


# Configure Cloudinary
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
)


def upload_profile_image(file) -> str:
    """
    Upload a profile image to Cloudinary.
    
    Args:
        file: File object from FastAPI upload
        
    Returns:
        URL of uploaded image
        
    Raises:
        HTTPException: If upload fails or invalid file
    """
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")
            
        if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/gif"]:
            raise HTTPException(status_code=400, detail="Invalid image format. Allowed: JPEG, PNG, WebP, GIF")
        
        # Read file content
        file_content = file.file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            folder="docmind/profiles",
            resource_type="image",
            quality="auto",
            fetch_format="auto",
        )
        
        return result.get("secure_url")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")


def upload_document(file) -> str:
    """
    Upload a document file to Cloudinary.
    Supports PDF, DOCX, and other common document formats.
    
    Args:
        file: File object from FastAPI upload
        
    Returns:
        URL of uploaded document
        
    Raises:
        HTTPException: If upload fails or invalid file
    """
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Allowed document MIME types
        allowed_types = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ]
        
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid document format. Allowed: PDF, DOCX, XLS, XLSX, PPT, PPTX, TXT"
            )
        
        # Read file content
        file_content = file.file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            folder="docmind/documents",
            resource_type="raw",
            public_id=file.filename.split('.')[0],
        )
        
        return result.get("secure_url")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document upload failed: {str(e)}")


def delete_file(public_id: str, resource_type: str = "image") -> bool:
    """
    Delete a file from Cloudinary by public_id.
    
    Args:
        public_id: Cloudinary public ID of the file
        resource_type: Type of resource ('image' or 'raw')
        
    Returns:
        True if deletion was successful
    """
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return True
    except Exception as e:
        print(f"Error deleting file from Cloudinary: {str(e)}")
        return False
