"""
Cloudinary Integration Documentation
=====================================

This document explains the refactored code that integrates Cloudinary for file uploads.

## Overview

The backend now uses Cloudinary for storing:

- User profile images
- Document files (PDF, DOCX, XLSX, etc.)

URLs are stored in MongoDB, allowing for easy retrieval and management.

## Files Modified/Created

### New Files Created:

1. **backend/controller/cloudinary_utils.py**
   - Core Cloudinary upload functions
   - upload_profile_image(file) -> str
   - upload_document(file) -> str
   - delete_file(public_id, resource_type) -> bool

### Files Modified:

1. **backend/config.py**
   - Added Cloudinary configuration from environment variables

2. **backend/.env**
   - Added Cloudinary credentials
   - Fixed typo: CLOUDINAR -> CLOUDINARY

3. **backend/models/user_schema.py**
   - Changed profile_url from HttpUrl to Optional[str]
   - profile_url is now optional during user creation (uploaded separately)

4. **backend/models/document_schema.py**
   - Changed document_url from HttpUrl to Optional[str]
   - document_url is now optional during document creation (uploaded separately)

5. **backend/controller/user_controller.py**
   - Added upload_user_profile_image(user_id, file) function
   - Automatically updates user record with Cloudinary URL

6. **backend/controller/document_controller.py**
   - Added upload_document_file(company_id, uploaded_by, document_name, file) function
   - Automatically creates document record with Cloudinary URL

7. **backend/routes/user.py**
   - Added POST /users/{user_id}/profile-image endpoint
   - Accepts multipart/form-data with image file

8. **backend/routes/document.py**
   - Added POST /documents/upload endpoint
   - Accepts multipart/form-data with document file and metadata

## Cloudinary Configuration

### Environment Variables (.env)

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Get these from your Cloudinary dashboard at https://cloudinary.com/console

### Folder Structure in Cloudinary

- **docmind/profiles/** - User profile images
- **docmind/documents/** - Uploaded documents

## API Endpoints

### Upload User Profile Image

```
POST /users/{user_id}/profile-image
Content-Type: multipart/form-data

Body:
- file: <image-file> (JPEG, PNG, WebP, GIF)

Response:
{
  "_id": "user_object_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "employee",
  "company_id": "company_object_id",
  "profile_url": "https://res.cloudinary.com/..."
}
```

### Upload Document

```
POST /documents/upload
Content-Type: multipart/form-data

Body:
- company_id: "company_object_id" (string)
- uploaded_by: "user_object_id" (string)
- document_name: "Document Name" (string)
- file: <document-file> (PDF, DOCX, XLSX, PPTX, TXT, etc.)

Response:
{
  "_id": "document_object_id",
  "document_name": "Document Name",
  "company_id": "company_object_id",
  "uploaded_by": "user_object_id",
  "document_url": "https://res.cloudinary.com/..."
}
```

## Supported File Formats

### Profile Images

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### Documents

- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Microsoft Excel (.xlsx, .xls)
- Microsoft PowerPoint (.pptx, .ppt)
- Text Files (.txt)

## User Signup Flow (With Profile Image)

1. User signs up via POST /auth/signup (profile_url is optional)
2. After signup, user gets user_id from response
3. User uploads profile image via POST /users/{user_id}/profile-image
4. MongoDB user record is updated with profile_url

Alternatively:

1. Include profile image upload in signup process (requires separate FORM data endpoint)

## Document Upload Flow

1. User calls POST /documents/upload with:
   - company_id (their company)
   - uploaded_by (their user_id)
   - document_name (name of document)
   - file (the document)
2. File is uploaded to Cloudinary
3. Document record is created in MongoDB with Cloudinary URL

## Database Storage

### MongoDB User Collection

```json
{
  "_id": ObjectId(...),
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "company_id": ObjectId(...),
  "password_hash": "$2b$12$...",
  "profile_url": "https://res.cloudinary.com/dqyseh8wv/image/upload/v1234567890/docmind/profiles/..."
}
```

### MongoDB Document Collection

```json
{
  "_id": ObjectId(...),
  "document_name": "Q1 Report",
  "company_id": ObjectId(...),
  "uploaded_by": ObjectId(...),
  "document_url": "https://res.cloudinary.com/dqyseh8wv/raw/upload/v1234567890/docmind/documents/..."
}
```

## Error Handling

All upload functions return HTTPException with appropriate status codes:

| Status | Reason                                  |
| ------ | --------------------------------------- |
| 400    | No file provided or invalid file format |
| 404    | User/Company/Document not found         |
| 409    | Email already exists (signup)           |
| 500    | Upload failed or server error           |

## Testing with cURL

### Upload Profile Image

```bash
curl -X POST http://localhost:8000/users/65f1234567890abcdef/profile-image \
  -F "file=@/path/to/image.jpg"
```

### Upload Document

```bash
curl -X POST http://localhost:8000/documents/upload \
  -F "company_id=65f1234567890abcdef" \
  -F "uploaded_by=65f1234567890abcdef" \
  -F "document_name=Q1 Report" \
  -F "file=@/path/to/document.pdf"
```

## Dependencies

Newly installed packages:

- **cloudinary** - Cloudinary SDK
- **python-multipart** - For handling multipart/form-data

Install with:

```bash
pip install cloudinary python-multipart
```

## Migration Notes

### From Previous Model

- **Before**: profile_url was required and expected a URL string from client
- **After**: profile_url is optional, populated by upload endpoint

### Backward Compatibility

- Existing users without profile_url will have profile_url: null
- Can be updated anytime via POST /users/{user_id}/profile-image
- All existing document URLs should still work

## Security Considerations

1. **Authentication**: Ensure endpoints are protected with JWT auth
2. **Authorization**: Users can only upload for their own profile/company
3. **File Validation**: Only allowed file types are accepted
4. **Cloudinary Configuration**: Use environment variables, never hardcode secrets
5. **File Size**: Adjust Cloudinary settings as needed for your use case

## Performance Tips

1. Images are automatically optimized by Cloudinary
2. Use quality="auto" and fetch_format="auto" for better compression
3. URLs are cacheable by CDN - no need to upload same file twice
4. Delete old files to manage Cloudinary storage costs

## Troubleshooting

### "Invalid image format" error

- Ensure file is JPEG, PNG, WebP, or GIF
- Check file extension matches actual content

### "Document upload failed" error

- Verify file is a supported document format
- Check file is not corrupted
- Ensure file size is within Cloudinary limits

### "Cloudinary connection failed"

- Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET are correct
- Check .env file is properly loaded
- Test credentials in Cloudinary dashboard

### Missing profile_url in response

- Profile image must be uploaded separately after user creation
- Check upload endpoint response for success before proceeding

## Future Enhancements

1. Add bulk document uploads
2. Implement document versioning
3. Add image resizing/cropping options
4. Implement file deletion for cleanup
5. Add Progress tracking for large uploads
6. PDF preview generation
7. Document compression
   """
