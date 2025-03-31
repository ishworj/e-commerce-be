import UserSchema from "./UserSchema.js"

// create user model
export const registerUserModel = (formObj) => {
    return UserSchema(formObj).save();
}

// finding user by email
export const getUserByEmail = (email) => {
    return UserSchema.find(email)
}