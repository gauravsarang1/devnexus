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
        sendMail(email, "DevNexus Account Verification", createVerificationEmailHtml(name, otp))
        .catch(console.error);
    };

    static verificationSuccessMail(data: {
        name: string,
        email: string
    }) {
        const { name, email } = data;
        sendMail(email, "DevNexus Account Verified Successfully", accountSuccessEmailHtml(name))
        .catch(console.error);
    }

    static verifyForgetPasswordMail(data: {
        name: string,
        email: string,
        otp: string
    }) {
        const { name, email, otp} = data;
        sendMail(email, "DevNexus Forget Password Verification", createForgotPasswordEmailHtml(name, otp))
        .catch(console.error);
    }

    static passwordResetSuccessMail(data:{
        name: string,
        email: string
    }) {
        const { name, email } = data;
        sendMail(email, "DevNexus Forget Account Password Successfully", passwordResetSuccessEmailHtml(name))
        .catch(console.error);
    }
}