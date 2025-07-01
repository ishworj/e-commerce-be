
import mongoose from "mongoose";

const FeatureBannerSchema = new mongoose.Schema(
    {
        featureBannerImgUrl: {
            type: String,
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        promoType: {
            type: String,
            enum: ["seasonal", "discounted", "new", "clearance"],
            required: true
        },

        redirectUrl: {
            type: String
        },

        expiresAt: {
            type: Date,
            required: true
        },

        createdAt: {
            type: Date,
            required: true
        },
    }

)
export default mongoose.model("FeatureBanner", FeatureBannerSchema)