import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, resetURL: string) => {
  if (process.env.EMAIL_PROVIDER === "gmail") {

    // nodemailer transporter configuration for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 560px;
            margin: 40px auto;
            padding: 20px;
          }
          .email-card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 32px 24px;
            text-align: center;
          }
          .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .email-body {
            padding: 32px 24px;
          }
          .greeting {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #1a1a1a;
          }
          .message {
            margin-bottom: 24px;
            color: #555;
          }
          .reset-button {
            text-align: center;
            margin: 32px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
          .fallback-link {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            margin: 24px 0;
            word-break: break-all;
            font-size: 14px;
          }
          .fallback-link p {
            margin: 0 0 8px 0;
            color: #666;
            font-size: 13px;
          }
          .fallback-link a {
            color: #667eea;
            text-decoration: none;
            word-break: break-all;
          }
          .fallback-link a:hover {
            text-decoration: underline;
          }
          .security-note {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 16px;
            margin: 24px 0;
            border-radius: 8px;
            font-size: 14px;
          }
          .security-note p {
            margin: 0;
            color: #856404;
          }
          .footer {
            text-align: center;
            padding: 24px;
            border-top: 1px solid #e9ecef;
            font-size: 12px;
            color: #6c757d;
          }
          .footer p {
            margin: 4px 0;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 20px auto;
              padding: 12px;
            }
            .email-header h1 {
              font-size: 24px;
            }
            .greeting {
              font-size: 18px;
            }
            .button {
              padding: 12px 24px;
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-card">
            <div class="email-header">
              <h1>🔐 Reset Your Password</h1>
            </div>
            <div class="email-body">
              <div class="greeting">
                Hello,
              </div>
              <div class="message">
                We received a request to reset the password for your account. Click the button below to create a new password:
              </div>
              
              <div class="reset-button">
                <a href="${resetURL}" class="button">Reset Password</a>
              </div>
              
              <div class="fallback-link">
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <a href="${resetURL}">${resetURL}</a>
              </div>
              
              <div class="security-note">
                <p>⚠️ This password reset link will expire in 10 minutes for security reasons. If you didn't request this, please ignore this email and your password will remain unchanged.</p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>If you need assistance, please contact our support team.</p>
              <p>&copy; ${new Date().getFullYear()} CineTube. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text fallback
    const textContent = `Reset Your Password\n\nWe received a request to reset the password for your account. Please use the link below to create a new password:\n\n${resetURL}\n\nThis password reset link will expire in 1 hour for security reasons. If you didn't request this, please ignore this email and your password will remain unchanged.\n\nIf you need assistance, please contact our support team.`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Reset Your Password - Secure Link",
      text: textContent,
      html: htmlContent,
    });

  } else {
    console.warn("No email provider configured. Skipping email sending.");
  }

};