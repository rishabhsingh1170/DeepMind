"""
Backend Architecture Documentation

## Directory Structure

```
backend/
├── main.py                 # FastAPI app entry point, initializes routers
├── config.py              # Configuration and environment variables
├── database/
│   ├── mongo.py          # MongoDB connection and collection exports
│   └── vector.py         # Vector database (Chroma) integration
├── models/
│   ├── common.py         # Common types (ObjectIdStr)
│   ├── user_schema.py    # Pydantic User models
│   ├── company_schema.py # Pydantic Company models
│   └── document_schema.py# Pydantic Document models
├── controller/           # Business logic layer
│   ├── utils.py         # Utility functions (password hashing, serialization)
│   ├── auth_controller.py     # Authentication logic
│   ├── user_controller.py     # User CRUD logic
│   ├── company_controller.py  # Company CRUD logic
│   └── document_controller.py # Document CRUD logic
├── routes/              # API endpoint definitions
│   ├── auth.py         # /auth/* endpoints
│   ├── user.py         # /users/* endpoints
│   ├── company.py      # /companies/* endpoints
│   └── document.py     # /documents/* endpoints
└── __pycache__/
```

## Architecture Flow

```
main.py (FastAPI App)
    ↓
    ├─→ routes/auth.py (APIRouter)
    │       ↓
    │   controller/auth_controller.py
    │       ↓
    │   database/mongo.py
    │
    ├─→ routes/user.py (APIRouter)
    │       ↓
    │   controller/user_controller.py
    │       ↓
    │   database/mongo.py
    │
    ├─→ routes/company.py (APIRouter)
    │       ↓
    │   controller/company_controller.py
    │       ↓
    │   database/mongo.py
    │
    └─→ routes/document.py (APIRouter)
            ↓
        controller/document_controller.py
            ↓
        database/mongo.py
```

## Layer Responsibilities

### 1. Routes Layer (routes/\*.py)

- Define FastAPI endpoints
- Handle HTTP request/response serialization
- Route incoming requests to controller logic
- Each file manages one resource (user, company, auth, document)

### 2. Controller Layer (controller/\*.py)

- Implement business logic
- Validate data constraints
- Handle database interactions
- Return processed data to routes
- Each file contains logic for one resource

### 3. Utility Layer (controller/utils.py)

- Shared functions used across controllers
- Password hashing: `hash_password()`, `verify_password()`
- Object serialization: `serialize_id()`

### 4. Database Layer (database/mongo.py)

- MongoDB connection management
- Collection exports
- Connection validation

### 5. Models Layer (models/\*.py)

- Pydantic schema definitions
- Request/response validation
- Custom type definitions

## Endpoints Summary

### Auth Routes (/auth)

```
POST /auth/login
  - Email + password login
  - Returns user details + success message
```

### User Routes (/users)

```
POST /users
  - Create user with email, password, profile URL
  - Password hashing handled automatically
  - Validates email uniqueness and company existence

GET /users
  - List all users (password_hash excluded)
```

### Company Routes (/companies)

```
POST /companies
  - Create new company

GET /companies
  - List all companies
```

### Document Routes (/documents)

```
POST /documents
  - Create new document
  - Validates company and uploader existence

GET /documents
  - List all documents
```

## Key Design Patterns

### 1. Separation of Concerns

- Routes handle HTTP layer
- Controllers handle business logic
- Utilities are shared across controllers

### 2. Error Handling

- HTTPException with appropriate status codes
- 400: Bad request (invalid ID format)
- 404: Resource not found
- 409: Conflict (email exists)
- 401: Unauthorized (login failed)

### 3. Security

- Passwords are hashed with bcrypt (never stored plain-text)
- Password_hash excluded from user responses
- Email uniqueness enforced

### 4. BSON Compatibility

- Pydantic v2 types (HttpUrl, EmailStr) converted to JSON mode
- Ensures MongoDB compatibility via model_dump(mode="json")

### 5. Import Flexibility

- All files support both module-based and direct imports
- Try/except pattern allows running from backend/ or root directory

## Adding New Features

### To add a new resource (e.g., Teams):

1. Create models/team_schema.py
   - Define TeamCreate, TeamResponse with Pydantic

2. Create controller/team_controller.py
   - Implement create_team_logic(), list_teams_logic()
   - Import database collections

3. Create routes/team.py
   - Import controller functions
   - Define FastAPI router with endpoints

4. Update main.py
   - Import routes.team
   - Add app.include_router(team.router)

## Running the Application

```bash
# From project root
python -m uvicorn backend.main:app --reload

# From backend directory
python -m uvicorn main:app --reload
```

## Testing Import Structure

```bash
# Verify app imports correctly
python -c "from backend.main import app; print('✓ App loaded')"
```

"""
