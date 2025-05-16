# Email Server

This is the email server for the Devote application. It handles sending and verifying OTPs for voting.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # Email settings
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_SERVICE=gmail

   # Server settings
   PORT=3001

   # Application settings
   OTP_EXPIRATION_TIME=7200000  # 2 hours in milliseconds
   ```

3. Start the server:
   ```
   node server.js
   ```

## API Endpoints

### Send OTP
- **URL**: `/send-otp`
- **Method**: `POST`
- **Body**: `{ "emails": ["user1@example.com", "user2@example.com"] }`
- **Validation**:
  - Emails array must contain at least one email
  - Each email must be in a valid format
- **Response**: 
  ```json
  {
    "message": "OTP processing completed",
    "sent": ["user1@example.com"],
    "failed": [{"email": "user2@example.com", "error": "Error message"}]
  }
  ```
- **Error Response**:
  ```json
  {
    "errors": [
      {
        "type": "field",
        "msg": "Invalid email format",
        "path": "emails[0]",
        "location": "body"
      }
    ]
  }
  ```

### Verify OTP
- **URL**: `/verify-otp`
- **Method**: `POST`
- **Body**: `{ "otp": "123456" }`
- **Validation**:
  - OTP is required
  - OTP must be a 6-digit numeric string
- **Success Response**: 
  ```json
  {
    "message": "OTP verified successfully"
  }
  ```
- **Error Response**:
  ```json
  {
    "message": "Invalid OTP"
  }
  ```
  or
  ```json
  {
    "message": "OTP has expired"
  }
  ```
  or validation errors in the format shown above

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2023-11-20T12:34:56.789Z"
  }
  ``` 