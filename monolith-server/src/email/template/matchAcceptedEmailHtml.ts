
export default function matchAcceptedEmailHtml(userName: string, partnerName: string) {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Swap Accepted! ✨</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hi ${userName},</p>
            <p style="font-size: 16px;">Great news! <strong>${partnerName}</strong> has accepted your skill swap request.</p>
            <p>You can now head over to the chat room to start collaborating and building your project together.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/chat" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Chatting</a>
            </div>
            <p>Happy swapping!<br/>The DevNexus Team</p>
        </div>
    </div>
    `;
}
