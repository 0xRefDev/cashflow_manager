import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER,
  },
});

export async function sendOtpEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"CashFlow" <${process.env.MAILER_USER}>`,
    to,
    subject: "Your CashFlow verification code",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Inter,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:16px;padding:48px 40px;">
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="color:#00E676;font-size:22px;font-weight:700;letter-spacing:-0.5px;">CashFlow</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">Verify your email address</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <p style="margin:8px 0 0;color:#888888;font-size:14px;line-height:1.6;">Enter the code below in the CashFlow app to complete your registration. It expires in <strong style="color:#aaaaaa;">10 minutes</strong>.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <div style="display:inline-block;background:#0A0A0A;border:1px solid #00E676;border-radius:14px;padding:18px 48px;">
                <span style="color:#00E676;font-size:38px;font-weight:700;letter-spacing:14px;font-variant-numeric:tabular-nums;">${code}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="border-top:1px solid #1a1a1a;padding-top:24px;">
              <p style="margin:0;color:#444444;font-size:12px;line-height:1.5;">If you didn't create a CashFlow account, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
