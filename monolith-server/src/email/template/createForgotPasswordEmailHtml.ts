export default function createForgotPasswordEmailHtml(
    name: string,
    otp: string
) {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #E53935;">DevNexus Password Reset</h2>

      <p>Hi ${name},</p>

      <p>
        We received a request to reset your DevNexus account password.
        Use the One-Time Password (OTP) below to proceed with resetting your password:
      </p>

      <div style="
        background-color: #f4f4f4;
        padding: 12px 18px;
        border-radius: 6px;
        display: inline-block;
        margin: 20px 0;
        letter-spacing: 3px;
      ">
        <strong style="font-size: 24px;">${otp}</strong>
      </div>

      <p>
        This OTP is valid for the next <strong>10 minutes</strong>.
        For security reasons, do not share this code with anyone.
      </p>

      <p>
        If you did not request a password reset, you can safely ignore this email.
        Your account will remain secure.
      </p>

      <p>
        Best regards,<br/>
        <strong>The DevNexus Team</strong>
      </p>
    </div>
  `;
}
