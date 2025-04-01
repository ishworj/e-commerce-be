import { userActivatedEmailTempalate } from "./emailTemplate.js";
import { eTransporter } from "./emailTransport.js";

export const userActivatedEmail = async (obj) => {
    const info = await eTransporter().sendMail(userActivatedEmailTempalate(obj))
    console.log(info.messageId)
    return info.messageId;
}