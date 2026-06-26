# Real-Time OTP Delivery (Email & SMS) Integration & Setup Guide

This guide provides instructions for configuring Nodemailer (via Gmail SMTP) and Twilio SMS for the LearnUp LMS Authentication OTP system.

---

## 1. Gmail SMTP Setup (App Password)

Because Gmail blocks standard login attempts from non-interactive scripts/servers, you must generate a dedicated **App Password** to authenticate Nodemailer.

### Step-by-Step Instructions:
1. **Enable 2-Step Verification**:
   - Go to your [Google Account Console](https://myaccount.google.com/).
   - Select **Security** from the left-hand navigation pane.
   - Under *How you sign in to Google*, click on **2-Step Verification** and complete the enrollment process if not already enabled.

2. **Generate App Password**:
   - Scroll to the bottom of the **2-Step Verification** settings page or search for "App Passwords" in the search bar.
   - If prompted, log back into your account.
   - Enter an app name (e.g., `LearnUp LMS`) and click **Create**.
   - Copy the generated 16-character passcode (e.g., `abcd efgh ijkl mnop`). *Note: Do not close this popup until you have copied the password, as it will not be displayed again.*

---

## 2. Twilio SMS Setup

To send SMS verification codes:
1. Sign up/Log in to the [Twilio Console](https://console.twilio.com/).
2. Locate and copy your **Account SID** and **Auth Token** from your dashboard.
3. Acquire a Twilio-enabled phone number from the *Phone Numbers* tab.

---

## 3. Environment Variable Configuration

Create or update the `.env.local` file in the root of the LearnUp LMS project directory:

```env
# ==============================================================================
# OTP DELIVERY CONFIGURATION (Nodemailer & Twilio)
# ==============================================================================

# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail-username@gmail.com
# Paste the 16-character app password (without spaces) generated in step 1:
SMTP_PASS=abcdefghijklmnop

# Twilio SMS Configuration
TWILIO_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+12345678901
```

---

## 4. Code Architecture Reference

### Service File: [mail.ts](file:///c:/Users/anujj/.gemini/antigravity-ide/scratch/learnup-lms/src/lib/mail.ts)
```typescript
import nodemailer from "nodemailer";
import twilio from "twilio";

export function validateCredentials() {
  const missing = [];
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_PORT) missing.push("SMTP_PORT");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
  if (!process.env.TWILIO_SID) missing.push("TWILIO_SID");
  if (!process.env.TWILIO_AUTH_TOKEN) missing.push("TWILIO_AUTH_TOKEN");
  if (!process.env.TWILIO_PHONE_NUMBER) missing.push("TWILIO_PHONE_NUMBER");
  
  if (missing.length > 0) return { valid: false, missing };
  return { valid: true };
}

export async function sendOTP(email: string, phone: string, otp: string) { ... }
```

### Registration Route: [route.ts](file:///c:/Users/anujj/.gemini/antigravity-ide/scratch/learnup-lms/app/api/auth/register/route.ts)
- Triggers `sendOTP(email, phone, otpCode)`.
- If delivery fails, it rolls back user registration (deletes database record) and returns a `502 Bad Gateway` status with `{ error: "Failed to send verification code." }`.
