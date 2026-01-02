import mailTransporter from "../config/mail.js";

export const sendMail = async (
  to: string,
  subject: string,
  html: string
) => {
  await mailTransporter.sendMail({
    from: `"SkillSwap" <${process.env.MAIL_USER!}>`,
    to,
    subject,
    html,
  });
};