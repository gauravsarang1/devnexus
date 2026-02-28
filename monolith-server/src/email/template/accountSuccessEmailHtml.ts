export default function accountSuccessEmailHtml(name: string) {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to DevNexus!</h2>
        <p>Hi ${name},</p>
        <p>Your account has been successfully created and verified. We're excited to have you on board!</p>
        <p>You can now log in to your account and start exploring the opportunities available on DevNexus.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br/>The DevNexus Team</p>
    </div>
    `;
}