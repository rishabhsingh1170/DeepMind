# Admin Chat Creation Flow

## Overview

This document describes the admin chat creation flow where an admin logs in, creates a chat with company details, and uploads a document.

## Key Constraints

- **One Chat Per Admin**: Each admin can only create and manage ONE chat in the system.
- **Admin-Only**: Only users with role `"admin"` can create chats.
- **Auto Company Creation**: If a company with the same name doesn't exist, it's created automatically during chat creation.

## Database Collections

### chats collection

```json
{
  "_id": ObjectId,
  "admin_id": "user_id_as_string",
  "company_id": "company_id_as_string",
  "document_id": "document_id_as_string",
  "created_at": ISODate,
  "updated_at": ISODate
}
```

**Unique Index**: `admin_id` has a unique index to enforce one chat per admin.

### documents collection (updated)

Documents created during chat creation now include:

```json
{
  "_id": ObjectId,
  "document_name": string,
  "company_id": string,
  "uploaded_by": "admin_id_as_string",
  "document_url": string (Cloudinary URL),
  "created_at": ISODate
}
```

## API Flow

### 1. Admin Sign Up

```
POST /auth/verify-otp-and-signup
Payload:
{
  "email": "admin@company.com",
  "otp": "123456",
  "name": "Admin User",
  "password": "SecurePassword123",
  "role": "admin"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "role": "admin",
    "_id": "admin_user_id",
    ...
  }
}
```

### 2. Admin Creates Chat with Company & Document

**Endpoint**: `POST /chats/create`

**Authentication**: Required (Bearer Token)

**Request**:

```
Headers:
Authorization: Bearer <access_token>

Body (multipart/form-data):
- company_name: string (e.g., "Acme Corp")
- document_name: string (e.g., "Company Knowledge Base")
- file: UploadFile (PDF, DOCX, XLSX, PPTX, TXT, etc.)
```

**Response** (201 Created):

```json
{
  "_id": "chat_id",
  "admin_id": "admin_user_id",
  "company_id": "newly_created_or_existing_company_id",
  "document_id": "uploaded_document_id",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

**Error Responses**:

- `401`: Missing/invalid/expired token
- `403`: User is not an admin
- `409`: Admin already has a chat
- `400`: Invalid ID format or file validation
- `500`: Upload service failed

### 3. Admin Retrieves Their Chat

**Endpoint**: `GET /chats/admin/me`

**Authentication**: Required (Bearer Token)

**Response** (200 OK):

```json
{
  "_id": "chat_id",
  "admin_id": "admin_user_id",
  "company_id": "company_id",
  "document_id": "document_id",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### 4. List All Chats (Admin/System Use)

**Endpoint**: `GET /chats/`

**Response** (200 OK):

```json
[
  {
    "_id": "chat_id_1",
    "admin_id": "admin_1",
    "company_id": "company_1",
    "document_id": "doc_1",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  },
  ...
]
```

### 5. Get Specific Chat by ID

**Endpoint**: `GET /chats/{chat_id}`

**Response** (200 OK):

```json
{
  "_id": "chat_id",
  "admin_id": "admin_user_id",
  "company_id": "company_id",
  "document_id": "document_id",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

## Implementation Details

### Chat Controller Logic (`chat_controller.py`)

The `create_chat_logic()` function performs the following steps:

1. **Admin Validation**
   - Validates admin user exists in database
   - Checks user has `role == "admin"`

2. **One-Per-Admin Check**
   - Queries `chats_collection` for existing chat with `admin_id`
   - Throws 409 Conflict if admin already has a chat

3. **Company Handling**
   - Checks if company with `company_name` exists
   - If not, creates a new company record with `created_by: admin_id`
   - Returns existing or new `company_id`

4. **Document Upload**
   - Uploads file to Cloudinary via `upload_document()` utility
   - Creates document record in `documents_collection` with:
     - `uploaded_by: admin_id`
     - `company_id: company_id`
     - `document_url: cloudinary_url`
     - `created_at: current_timestamp`

5. **Chat Creation**
   - Creates chat record with all three references: `admin_id`, `company_id`, `document_id`
   - Sets timestamps (`created_at` and `updated_at`)
   - Inserts into `chats_collection`

### Authentication (`routes/chat.py`)

- All chat endpoints requiring authentication use the `get_current_user_from_token()` dependency
- JWT token is extracted from `Authorization: Bearer <token>` header
- Token is decoded using `JWT_SECRET_KEY` and `JWT_ALGORITHM` from config
- Validates token hasn't expired
- Returns decoded payload with `sub` (user_id) and `role`

## Architecture Summary

```
Admin Sign Up (with role="admin")
    ↓
Admin Logged In (receives JWT token)
    ↓
POST /chats/create (multipart form + bearer token)
    ↓
JWT Validation + Admin Role Check
    ↓
Validate Admin Not Already Chained
    ↓
Create/Fetch Company
    ↓
Upload Document to Cloudinary
    ↓
Create Chat Record (links admin → company → document)
    ↓
Chat Ready for Use
```

## Example CURL Command

```bash
curl -X POST http://localhost:8000/chats/create \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "company_name=Acme Corp" \
  -F "document_name=Company Policies" \
  -F "file=@/path/to/document.pdf"
```

## Notes

- **Timestamps**: Both `created_at` and `updated_at` are set to UTC timestamps
- **ObjectId Serialization**: All MongoDB ObjectIds are converted to strings in API responses
- **Company Reuse**: If multiple admins create chats and use the same company name, they'll get the same company
- **Future Enhancement**: Update endpoint to modify chat details (e.g., replace document)
