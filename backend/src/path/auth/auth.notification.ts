import createVerificationEmailHtml from "../../email/template/createVerificationEmailHtml.js";
import accountSuccessEmailHtml from "../../email/template/accountSuccessEmailHtml.js";
import { sendMail } from "../../email/sendMail.js";
import createForgotPasswordEmailHtml from "../../email/template/createForgotPasswordEmailHtml.js";
import passwordResetSuccessEmailHtml from "../../email/template/passwordResetSuccessEmailHtml.js";

export class AuthNotifier {
    static verifyEmailMail(data: {
        name: string,
        email: string
        otp: string
    }) {
        const { email, name, otp } = data;
        sendMail(email, "Skillswap Account Verification", createVerificationEmailHtml(name, otp))
        .catch(console.error);
    };

    static verificationSuccessMail(data: {
        name: string,
        email: string
    }) {
        const { name, email } = data;
        sendMail(email, "Skillswap Account Verified Successfully", accountSuccessEmailHtml(name))
        .catch(console.error);
    }

    static verifyForgetPasswordMail(data: {
        name: string,
        email: string,
        otp: string
    }) {
        const { name, email, otp} = data;
        sendMail(email, "Skillswap Forget Password Verification", createForgotPasswordEmailHtml(name, otp))
        .catch(console.error);
    }

    static passwordResetSuccessMail(data:{
        name: string,
        email: string
    }) {
        const { name, email } = data;
        sendMail(email, "Skillswap Forget Account Password Successfully", passwordResetSuccessEmailHtml(name))
        .catch(console.error);
    }
}