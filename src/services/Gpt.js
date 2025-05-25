import { openai } from "../config/lmm.config.js";

export const AiResponse = async ({
  prompt = "",
  UserQuestion = "",
  response = null,
} = {}) => {
  if (UserQuestion) {
    prompt = `User asked: "${UserQuestion}".\nThe AI returned the following result: ${response}.\nYour job is to simply summarize this result in friendly, human-readable language. DO NOT include code or query terms. DO NOT evaluate or criticize. Just explain the result in html tags .`;
  }

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: !UserQuestion
          ? "You are a helpful assistant that writes MongoDB aggregation queries and explanations. ONLY use aggregation pipelines."
          : "You are a helpful assistant who summarizes AI-generated data into clear, friendly, and accurate explanations. No code, no judgments — response in html tags.",
      },
      { role: "user", content: prompt },
    ],
  });

  let raw = gptResponse.choices[0].message?.content;

  if (UserQuestion && raw) {
    raw = raw.replace(/"([^"]+)"/g, "$1"); // remove quotes around words
  }

  return UserQuestion ? raw : JSON.parse(raw);
};
  
