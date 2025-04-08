import { userActivatedEmailTempalate } from "./email.template.js";
import { eTransporter } from "./email.transport.js";

export const userActivatedEmail = async (obj) => {
    const info = await eTransporter().sendMail(
        userActivatedEmailTempalate(obj)
    );
    console.log(info.messageId);
    return info.messageId;
};
