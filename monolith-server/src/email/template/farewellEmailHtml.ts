
export default function farewellEmailHtml(name: string) {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #64748b; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Account Closed</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hi ${name},</p>
            <p>We're confirming that your DevNexus account has been successfully deleted and all your personal data has been removed from our active systems.</p>
            <p>We're sorry to see you go! If you ever decide to come back and continue your learning journey, our community will be here waiting for you.</p>
            <p>If this deletion was an error, please contact our support team immediately.</p>
            <p>Best of luck with your future builds,<br/>The DevNexus Team</p>
        </div>
    </div>
    `;
}
