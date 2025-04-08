import { AuthSessionSchema } from "./session.schema.js";

export const insertAuthSession = (token) => {
    return AuthSessionSchema(token).save();
};

export const findAuthSessionById = (filter) => {
    return AuthSessionSchema.findById(filter);
};

export const findAuthSessionByIdandDelete = (filter) => {
    return AuthSessionSchema.findByIdAndDelete(filter);
};
