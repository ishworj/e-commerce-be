import UserBehaviour from "./userHistorySchema.js";

export const createUserHistory = async (historyObj) => {
    try {
        const newEntry = new UserBehaviour(historyObj); // ✅ Ensures `this` context is correct
        return await newEntry.save();
    } catch (error) {
        console.error("❌ Error in createUserHistory:", error.message);
        throw error;
    }
};


// user history
export const getUserHistory = (filter) => {
    return UserBehaviour.find(filter).sort({ createdAt: -1 })
}
