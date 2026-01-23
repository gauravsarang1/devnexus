export default function passwordResetSuccessEmailHtml(name: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Password Reset Successful</h2>
        <p>Hi ${name},</p>
        <p>Your Skillswap account password has been successfully reset.</p>
        <p>You can now log in using your new password and continue exploring Skillswap.</p>
        <p>If you did not perform this action or believe your account may be at risk, please contact our support team immediately.</p>
        <p>Best regards,<br/>The Skillswap Team</p>
    </div>
  `;
}
