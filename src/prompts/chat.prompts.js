import { PromptTemplate } from "@langchain/core/prompts";

const schemaText = `
Collections and Fields:
- users: _id, fName, lName, phone, email, role, verified, createdAt, updatedAt
- products: _id, description, stock, name, price, category(_id of categories), status, images(Array), createdAt
- orders: _id, userId(_id of users), products(Array), totalAmount, status, createdAt
- categories: _id, categoryName, categoryImage, displaytitle, featureImageUrl
- reviews: _id, productId, userId, rating, comment

Response Format:
{
  "collection": "collection_name",      // e.g. 'users', 'products'
  "explanation": "text explanation",     // human readable
  "type": "query",                       // always "query"
  "options": {
    "aggregate": [ ... ]                // MongoDB aggregation pipeline
  }
}
`;

const template = `
Question: {question}
You are a MongoDB expert. Use this schema:
{schema}

Current date: {current_date}

Analyze this request by checking matching fields from the schema and respond ONLY in the specified JSON format.

Rules:
1. ALWAYS use MongoDB aggregation pipelines.
2. Use collection names exactly as shown in the schema (e.g., 'users', 'products').
3. NEVER use .find() or raw queries.
4. Only use the "options.aggregate" array for MongoDB queries.
5. Respond with valid JSON only — no markdown, no extra text.
6. The value of "type" should always be "query".
`;

export const getPrompt = async (question) => {
  const promptTemplate = PromptTemplate.fromTemplate(template);
  return promptTemplate.format({
    schema: schemaText,
    question,
    current_date: new Date().toISOString(),
  });
};
