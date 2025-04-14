import { AuthSessionSchema, OtpSessionSchema } from "./session.schema.js";

export const insertAuthSession = (token) => {
    return AuthSessionSchema(token).save();
};

export const findAuthSessionById = (filter) => {
    return AuthSessionSchema.findById(filter);
};

export const findAuthSessionByIdandDelete = (filter) => {
    return AuthSessionSchema.findByIdAndDelete(filter);
};


//  for OTP
export const insertOTP = (otp) => {
    return OtpSessionSchema(otp).save()
}
export const findOTP = (filter) => {
    return OtpSessionSchema.findOne(filter);
}
export const findOTPAndDelete = (filter) => {
    return OtpSessionSchema.findOneAndDelete(filter, { new: true })
}