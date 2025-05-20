import { getPrompt } from "../prompts/chat.prompts.js";
import { connectDB } from "../config/mongo.client.js";
import { openai } from "../config/lmm.config.js";

export const getChatResponse = async (question) => {
  try {
    const db = await connectDB();
    const prompt = await getPrompt(question);
    console.log("Generated prompt:", prompt);

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that writes MongoDB queries and summaries.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = gptResponse.choices[0].message?.content;
    console.log("LLM raw output:", raw);

    const response = JSON.parse(raw);

    let result, finalResponse;
    const collection = db.collection(response.collection);

    if (response.type === "query") {
      // Handle aggregation or normal query
      if (response.options?.aggregate) {
        result = await collection
          .aggregate(response.options.aggregate)
          .toArray();
      } else {
        result = await collection
          .find(response.query, response.options || {})
          .toArray();
      }

      console.log("LLM query result:", result);

      finalResponse = {
        type: "text",
        text: response.explanation, // No placeholder replacement
        data: result,
      };
    } else if (response.type === "chart") {
      const chartData = await collection
        .aggregate([
          { $match: response.query },
          {
            $group: {
              _id: `$${response.xAxis}`,
              value: { $sum: `$${response.yAxis}` },
            },
          },
        ])
        .toArray();

      finalResponse = {
        type: "chart",
        chartType: response.chartType,
        data: chartData,
        explanation: response.explanation,
        xAxis: response.xAxis,
        yAxis: response.yAxis,
      };
    } else {
      throw new Error("Unknown response type from LLM");
    }

    return finalResponse;
  } catch (err) {
    console.error("Error in getChatResponse:", err);
    return {
      type: "error",
      text: "Sorry, I couldn't process your request. Please try again.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    };
  }
};
