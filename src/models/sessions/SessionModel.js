import { SessionSchema } from "./SessionSchema.js";

export const insertSession = (token) => {
    return SessionSchema(token).save()
}

export const findToken = (token) => {
    return SessionSchema.findOne(token)
}