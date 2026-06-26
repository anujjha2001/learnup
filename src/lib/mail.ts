import nodemailer from "nodemailer";
import twilio from "twilio";

// Debug Initialization Log
console.log(`[SMTP Mailer Initialization] Loaded SMTP_USER: ${process.env.SMTP_USER || "NOT_LOADED"}`);

// Validate SMTP env vars
export function validateCredentials() {
  const missing = [];
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || host === "") missing.push("SMTP_HOST");
  if (!port || port === "") missing.push("SMTP_PORT");

  // Detect standard placeholder usernames or emails starting with "your-"
  if (!user || user === "" || user.startsWith("your-") || user === "your-email@gmail.com") {
    missing.push("SMTP_USER");
  }
  if (!pass || pass === "" || pass === "abcdefghijklmnop" || pass === "your_smtp_password" || pass === "hxcg jyzk gsnh nuff placeholder") {
    missing.push("SMTP_PASS");
  }

  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
}

export async function sendOTP(
  email: string,
  phone: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  // Strict SMTP check - with fallback
  const validation = validateCredentials();
  if (!validation.valid) {
    const missingFields = validation.missing || [];
    console.warn(`[SMTP Mailer Warning] SMTP Configuration is invalid or missing: ${missingFields.join(", ")}. Falling back to console logging.`);
    console.log(`\n==========================================\n[DEVELOPMENT OTP BYPASS] Verification Code for ${email}: ${otp}\n==========================================\n`);

    // Attempt Twilio SMS fallback if configured
    await attemptTwilioSMS(phone, otp);

    return {
      success: true,
      error: `Invalid SMTP configuration (missing: ${missingFields.join(", ")}). OTP logged to console.`
    };
  }

  try {
    // 1. Send Email via Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"LearnUp LMS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your LearnUp Verification Code",
      text: `Your LearnUp verification code is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f8f9ff; border-radius: 12px; border: 1px solid #e2dfff;">
          <h2 style="color: #3525cd; margin-bottom: 20px;">Welcome to LearnUp!</h2>
          <p style="color: #0b1c30; font-size: 16px;">Please use the following verification code to complete your registration:</p>
          <div style="font-size: 32px; font-weight: bold; color: #3525cd; letter-spacing: 4px; background: white; padding: 15px; text-align: center; border-radius: 8px; border: 1px dashed #712ae2; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #464555; font-size: 14px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // Log email structure before sending
    console.log(`[SMTP Mailer] Attempting to send email. Structure:`, {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      textLength: mailOptions.text.length,
    });

    // Send email with success/error logging
    await transporter.sendMail(mailOptions)
      .then((info) => {
        console.log(`[SMTP Mailer Success] Email sent successfully to ${email}. MessageID: ${info.messageId}`);
      })
      .catch((err) => {
        console.error(`[SMTP Mailer Error] Failed sending email to ${email}:`, err);
        throw err;
      });

    // 2. Send SMS via Twilio
    await attemptTwilioSMS(phone, otp);

    return { success: true };
  } catch (error: any) {
    console.error("OTP Delivery failed:", error);
    console.warn(`[SMTP Mailer Fallback] Falling back to console logging.`);
    console.log(`\n==========================================\n[DEVELOPMENT OTP BYPASS] Verification Code for ${email}: ${otp}\n==========================================\n`);
    return { success: true, error: error.message || "Failed to send OTP email (logged to console)" };
  }
}

async function attemptTwilioSMS(phone: string, otp: string) {
  const twilioSid = process.env.TWILIO_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioToken && twilioPhone && !twilioSid.includes("ACXXX") && !twilioToken.includes("your_")) {
    try {
      console.log(`[Twilio SMS] Attempting to send SMS to ${phone}...`);
      const twilioClient = twilio(twilioSid, twilioToken);
      await twilioClient.messages.create({
        body: `Your LearnUp verification code is: ${otp}`,
        from: twilioPhone,
        to: phone,
      });

      console.log(`[Twilio SMS Success] SMS sent successfully to ${phone}`);
    } catch (smsError: any) {
      console.warn(`[Twilio SMS Warning] Twilio SMS delivery failed but proceeding:`, smsError.message || smsError);
    }
  } else {
    console.warn(`[Twilio SMS Warning] Twilio is not configured. Proceeding with Email.`);
  }
}