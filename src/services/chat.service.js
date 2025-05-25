import { getPrompt } from "../prompts/chat.prompts.js";
import { connectDB } from "../config/mongo.client.js";
import { AiResponse } from "./Gpt.js";

export const getChatResponse = async (question) => {
  try {
    const db = await connectDB();
    const prompt = await getPrompt(question);

    const response = await AiResponse({ prompt });

    if (!response.collection || !Array.isArray(response.options?.aggregate)) {
      throw new Error(
        "Invalid response format: missing collection or aggregate pipeline."
      );
    }
    const collection = db.collection(response.collection);
    const result = await collection
      .aggregate(response.options.aggregate)
      .toArray();

      console.log(111111111111,result);

    const userResponse = await AiResponse({
      UserQuestion: question ,
      response:  JSON.stringify(result),
    });

    return {
      type: "text",
      data: userResponse, 
    };
  } catch (err) {
    console.error("Error in getChatResponse:", err);
    return {
      type: "error",
      text: "Sorry, I couldn't process your request. Please try again.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    };
  }
};

