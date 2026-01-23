const nodemailer = require("nodemailer");

// Create transporter with Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send password reset code via email
const sendResetCode = async (email, code, userName) => {
  try {
    const transporter = createTransporter();
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP VERIFY ERROR:", error);
      } else {
        console.log("SMTP server is ready to take messages");
      }
    });


    const mailOptions = {
      from: `"Chat-o-Philic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code - Chat-o-Philic",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f6f9;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
                padding: 30px;
                text-align: center;
                color: #ffffff;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
              }
              .greeting {
                font-size: 18px;
                color: #1f2937;
                margin-bottom: 20px;
              }
              .message {
                color: #4b5563;
                line-height: 1.6;
                margin-bottom: 30px;
              }
              .code-container {
                background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
                border: 2px solid #3B82F6;
                border-radius: 8px;
                padding: 25px;
                text-align: center;
                margin: 30px 0;
              }
              .code {
                font-size: 36px;
                font-weight: 700;
                color: #1E40AF;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
              }
              .code-label {
                font-size: 14px;
                color: #6b7280;
                margin-top: 10px;
              }
              .warning {
                background-color: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .warning p {
                margin: 0;
                color: #92400E;
                font-size: 14px;
              }
              .footer {
                background-color: #f9fafb;
                padding: 20px 30px;
                text-align: center;
                color: #6b7280;
                font-size: 13px;
                border-top: 1px solid #e5e7eb;
              }
              .footer a {
                color: #3B82F6;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
              </div>
              <div class="content">
                <div class="greeting">Hello ${userName || "User"},</div>
                <div class="message">
                  <p>We received a request to reset your password for your Chat-o-Philic account.</p>
                  <p>Use the verification code below to reset your password:</p>
                </div>
                <div class="code-container">
                  <div class="code">${code}</div>
                  <div class="code-label">Enter this code to reset your password</div>
                </div>
                <div class="warning">
                  <p><strong>⚠️ Important:</strong> This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
                </div>
                <div class="message">
                  <p>For security reasons, never share this code with anyone.</p>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated email from Chat-o-Philic. Please do not reply.</p>
                <p>Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">support</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Hello ${userName || "User"},

We received a request to reset your password for your Chat-o-Philic account.

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

For security reasons, never share this code with anyone.

- Chat-o-Philic Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    throw new Error("Failed to send password reset email");
  }
};

module.exports = { sendResetCode };
