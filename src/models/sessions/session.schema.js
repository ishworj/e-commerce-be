import mongoose from "mongoose";

const baseSessionSchema =
{
    token: {
        type: String,
        required: true
    },

    associate: {
        type: String
    }

}

// login sessionschema
const Session = new mongoose.Schema(baseSessionSchema, { timestamps: true }
)

// verifying sessionschema
const AuthSession = new mongoose.Schema(
    {
        ...baseSessionSchema,
        expiresAt:
        {
            type: Date, default: Date.now, expires: 60 * 60 * 1
        }
    })

export const SessionSchema = mongoose.model("session", Session)
export const AuthSessionSchema = mongoose.model("authSession", AuthSession)