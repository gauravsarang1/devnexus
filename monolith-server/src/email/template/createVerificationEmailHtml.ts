export default function createVerificationEmailHtml(name: string, otp: string) {
    // HTML email template company name DevNexus
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">DevNexus Account Verification</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with DevNexus! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block; margin: 20px 0;">
            <strong style="font-size: 24px;">${otp}</strong>
        </div>
        <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Best regards,<br/>The DevNexus Team</p>
    </div>
    `;
}