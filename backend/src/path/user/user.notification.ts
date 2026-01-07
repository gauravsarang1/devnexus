import farewellEmailHtml from "../../email/template/farewellEmailHtml.js";
import { sendMail } from "../../email/sendMail.js";

export class UserNotifier {
    static accountCloseMail(data: {
        email: string,
        name: string
    }) {
        const { name, email } = data!;
        sendMail(email, "Your SkillSwap Account has been Closed", farewellEmailHtml(name));
    }
}