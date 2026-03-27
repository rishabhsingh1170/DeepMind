# Email Verification with OTP - Implementation Guide

## Overview

A two-step signup process has been implemented to verify user email addresses before account creation. Users must:

1. Request an OTP (One-Time Password) to their email
2. Verify the OTP within the expiration window
3. Complete signup with verified email

This prevents fake/invalid email signups and improves account security.

## Architecture

### Components

#### 1. **Email Utilities** (`backend/controller/email_utils.py`)

- `generate_otp()` - Creates random 6-digit OTP
- `send_otp_email(email)` - Sends OTP via SMTP to email
- `verify_otp(email, otp)` - Validates OTP against stored value

#### 2. **OTP Collection** (MongoDB)

- Database: `DocMindCluster`
- Collection: `otp_tokens`
- TTL Index: Auto-deletes expired OTPs after expiration time

#### 3. **Configuration** (`backend/config.py`)

- SMTP server details (Gmail or custom)
- Email credentials
- OTP expiration time (default: 10 minutes)

#### 4. **API Endpoints** (`backend/routes/auth.py`)

- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp-and-signup` - Verify OTP and create account

## Setup Instructions

### 1. Configure Email (Gmail Example)

#### For Gmail:

1. Go to myaccount.google.com
2. Select "Security" in left sidebar
3. Enable "2-Step Verification"
4. Search for "App passwords"
5. Select "Mail" and "Windows Computer" (or your device)
6. Copy the 16-character app password

#### Update `.env` file:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
SENDER_EMAIL=your_email@gmail.com
OTP_EXPIRATION_MINUTES=10
```

### 2. For Other Email Providers

**Outlook/Hotmail:**

```env
SMTP_SERVER=smtp.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your_email@outlook.com
SMTP_PASSWORD=your_password
SENDER_EMAIL=your_email@outlook.com
```

**Custom SMTP Server:**

```env
SMTP_SERVER=smtp.your-company.com
SMTP_PORT=587
SMTP_USERNAME=your_username
SMTP_PASSWORD=your_password
SENDER_EMAIL=noreply@your-company.com
```

## API Endpoints

### 1. Send OTP to Email

**Endpoint:** `POST /auth/send-otp`

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**

```json
{
  "message": "OTP sent to user@example.com",
  "email": "user@example.com",
  "expires_in": 600
}
```

**Error Responses:**

- `409 Conflict` - Email already registered
- `500 Internal Server Error` - Failed to send email

---

### 2. Verify OTP and Complete Signup

**Endpoint:** `POST /auth/verify-otp-and-signup`

**Request:**

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe",
  "password": "securepass123",
  "role": "employee",
  "profile_url": null,
  "company_id": null
}
```

**Response (201 Created):**

```json
{
  "message": "Signup successful. Admin will assign you to a company shortly.",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee",
    "company_id": null,
    "profile_url": null
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid or expired OTP
- `409 Conflict` - Email already registered
- `400 Bad Request` - Email mismatch (email in request doesn't match token)

## Signup Flow

```
1. User sends email via POST /auth/send-otp
   ↓
2. System checks if email already exists
   ↓
3. Generate 6-digit OTP
   ↓
4. Store OTP in MongoDB with expiration
   ↓
5. Send OTP via email (HTML formatted)
   ↓
6. User receives email with OTP
   ↓
7. User submits OTP + signup details via POST /auth/verify-otp-and-signup
   ↓
8. System verifies OTP validity and expiration
   ↓
9. Delete confirmed OTP from database
   ↓
10. Create user account
    ↓
11. Generate JWT token
    ↓
12. Return JWT + user profile
```

## Database Schema

### OTP Collection (`otp_tokens`)

```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "otp": "123456",
  "created_at": ISODate("2025-03-27T10:30:00Z"),
  "expires_at": ISODate("2025-03-27T10:40:00Z")
}
```

**TTL Index:**

- Field: `expires_at`
- Auto-delete: 0 seconds after expiration
- Purpose: Automatic cleanup of expired OTPs

## Security Features

### OTP Generation

- Random 6-digit codes (1,000,000 combinations)
- Not sequential (prevents prediction)
- Generated using `secrets` module (cryptographically secure)

### Email Verification

- OTP automatically deleted after verification
- OTPs expire (default: 10 minutes)
- Expired OTPs auto-deleted by MongoDB TTL
- Rate limiting recommended (future enhancement)

### Data Protection

- Passwords hashed with bcrypt before storage
- Email credentials in .env (not in code)
- OTPs never logged or exposed in responses
- Email URLs never leaked in errors

### Validation

- Email format validated (Pydantic EmailStr)
- Email uniqueness checked before OTP sending
- OTP format validated (must be 6 digits)
- Email address verified before signup

## Usage Examples

### Example 1: Complete Signup Flow

**Step 1: Request OTP**

```bash
curl -X POST http://localhost:8000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

**Response:**

```json
{
  "message": "OTP sent to john@example.com",
  "email": "john@example.com",
  "expires_in": 600
}
```

**Step 2: User checks email and gets OTP: `123456`**

**Step 3: Verify OTP and Complete Signup**

```bash
curl -X POST http://localhost:8000/auth/verify-otp-and-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456",
    "name": "John Doe",
    "password": "MyPassword123",
    "role": "employee",
    "profile_url": null,
    "company_id": null
  }'
```

**Response:**

```json
{
  "message": "Signup successful. Admin will assign you to a company shortly.",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "company_id": null,
    "profile_url": null
  }
}
```

### Example 2: Error - Invalid OTP

```bash
curl -X POST http://localhost:8000/auth/verify-otp-and-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "999999",
    ...
  }'
```

**Response (400 Bad Request):**

```json
{
  "detail": "Invalid OTP. Please try again."
}
```

### Example 3: Error - Expired OTP

**After 10 minutes without verification:**

```json
{
  "detail": "OTP has expired. Please request a new one."
}
```

## Email Template

Users receive an email with the OTP formatted as:

```
Email Verification Required

Welcome to DocMind! Please verify your email by entering the OTP below:

        123456

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.
```

## Frontend Integration

### Signup Page Structure

```
Step 1: Email Verification
├─ Email Input Field
├─ "Send OTP" Button
│  └─ Calls: POST /auth/send-otp
│  └─ Shows: Loading state, success message
├─ OTP Input Field (6 digits)
├─ "Verify OTP" Button
│  └─ Disabled until OTP received
└─ Resend Link (after 30 seconds)

Step 2: Account Details
├─ Name Input
├─ Password Input (min 8 chars)
├─ Role Selection (employee/admin)
├─ Profile Image Upload (optional)
├─ Company Selection (optional - admin assigns later)
├─ "Complete Signup" Button
│  └─ Calls: POST /auth/verify-otp-and-signup
│  └─ Returns: JWT token
└─ Terms & Conditions Checkbox
```

### Implementation Tips

1. **Disable signup button** until OTP is sent
2. **Show countdown timer** for OTP expiration
3. **Allow resending** OTP (implement rate limiting)
4. **Validate password** at frontend (min 8 chars, mix of upper/lower/numbers)
5. **Store JWT** in localStorage or sessionStorage
6. **Redirect** to dashboard after successful signup

## Troubleshooting

### OTP Not Received

**Check:**

1. ✓ Email address typed correctly (no typos)
2. ✓ Check spam/junk folder
3. ✓ SMTP credentials in .env are correct
4. ✓ App password used (not account password for Gmail)
5. ✓ Internet connection is stable

**Solution:**

- Click "Send OTP" again (new OTP generated each time)
- Wait 30 seconds before resending

### SMTP Connection Failed

**Error:** `Failed to send email: [Errno ...] Connection refused`

**Causes:**

- Wrong SMTP server address
- Wrong SMTP port
- Firewall blocking SMTP
- Credentials incorrect

**Solution:**

- Verify SMTP settings in .env
- Test with debugmail or temp email service
- Check firewall settings

### Email Says "Less Secure App"

**For Gmail:**

- Use App Password (not account password)
- Enable 2-Factor Authentication first
- Go to myaccount.google.com → Security → App passwords

### OTP Always Says "Invalid"

**Check:**

- User typed OTP correctly (case-sensitive, no spaces)
- OTP hasn't expired yet
- Correct email used in both requests
- Only 1 OTP per email at a time

## Future Enhancements

1. **Rate Limiting** - Limit OTP requests per email (e.g., 5 per hour)
2. **OTP Resend Link** - Frontend button to resend OTP
3. **SMS OTP** - Send OTP via SMS instead of email
4. **Backup Codes** - Generate backup codes for account recovery
5. **Email Verification Badge** - Show verified status on profile
6. **Multi-Channel** - Support email + SMS verification
7. **Custom Email Templates** - Allow branding customization
8. **OTP History** - Track verification attempts

## Migration Notes

For existing deployments:

- New users MUST verify email before signup
- Existing verified users can continue with password login
- No changes required to login endpoint
- MongoDB `otp_tokens` collection auto-created on first OTP request
