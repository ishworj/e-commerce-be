import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// encrypting the password 
export const encryptPassword = async (text) => {
    return await bcrypt.hash(text, SALT_ROUNDS)
}
// comparing the password
export const comparePassword = async (plainText, encryptText) => {
    return await bcrypt.compare(plainText, encryptText)
}
