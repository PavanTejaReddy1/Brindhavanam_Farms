import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOTPEmail(
  to: string,
  otp: string,
  name?: string
): Promise<void> {
  const displayName = name || "there";

  await transporter.sendMail({
    from: `"Brindhavanam Farms" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Reset OTP – Brindhavanam Farms",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset OTP</title>
      </head>
      <body style="margin:0;padding:0;background:#F8F6F0;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F0;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:#10271C;padding:32px 40px;text-align:center;">
                    <p style="margin:0;color:#D4AF37;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Brindhavanam Farms</p>
                    <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:600;">Password Reset</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="margin:0 0 16px;color:#10271C;font-size:15px;line-height:1.6;">Hi ${displayName},</p>
                    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                      We received a request to reset your password. Use the OTP below to proceed. It is valid for <strong>10 minutes</strong>.
                    </p>
                    <!-- OTP Box -->
                    <div style="background:#F8F6F0;border:2px dashed #D4AF37;border-radius:16px;padding:28px;text-align:center;margin:0 0 28px;">
                      <p style="margin:0 0 6px;color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Your OTP</p>
                      <p style="margin:0;color:#10271C;font-size:42px;font-weight:700;letter-spacing:12px;">${otp}</p>
                    </div>
                    <p style="margin:0 0 8px;color:#555;font-size:14px;line-height:1.6;">
                      If you did not request a password reset, you can safely ignore this email. Your account remains secure.
                    </p>
                    <p style="margin:0;color:#999;font-size:12px;">This OTP expires in 10 minutes and can only be used once.</p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#F8F6F0;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
                    <p style="margin:0;color:#999;font-size:12px;">© ${new Date().getFullYear()} Brindhavanam Farms · Farm-Fresh Dairy Delivered Daily</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${displayName},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n– Brindhavanam Farms`,
  });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
