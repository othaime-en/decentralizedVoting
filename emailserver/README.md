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
- **Response**: `OTP sent successfully to all provided emails`

### Verify OTP
- **URL**: `/verify-otp`
- **Method**: `POST`
- **Body**: `{ "otp": "123456" }`
- **Response**: `OTP verified successfully` 