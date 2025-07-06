
import mongoose from "mongoose";

const FeatureBannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        featureBannerImgUrl: {
            type: String,
            required: true
        },

        products: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            }
        ],

        promoType: {
            type: String,
            enum: ["seasonal", "discounted", "new", "clearance"],
            required: true
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