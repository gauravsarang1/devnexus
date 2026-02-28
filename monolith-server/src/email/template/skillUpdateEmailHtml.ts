
export default function skillUpdateEmailHtml(name: string, skillName: string, role: string, level: string) {
    const roleText = role === 'TEACH' ? 'Expertise' : 'Learning Goal';
    const color = role === 'TEACH' ? '#10b981' : '#2563eb';
    
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: ${color}; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Profile Updated 🚀</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hi ${name},</p>
            <p>Your DevNexus profile has been updated with a new ${roleText.toLowerCase()}.</p>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: ${color};">${roleText}</p>
                <p style="margin: 5px 0; font-size: 18px;"><strong>${skillName}</strong></p>
                <p style="margin: 0; font-size: 14px; color: #666;">Level: ${level}</p>
            </div>
            <p>Keeping your profile up to date helps us find better matches for you!</p>
            <p>Best regards,<br/>The DevNexus Team</p>
        </div>
    </div>
    `;
}
