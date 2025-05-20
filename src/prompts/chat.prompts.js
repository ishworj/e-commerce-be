import { PromptTemplate } from "@langchain/core/prompts";

const schemaText = `
Collections and Fields:
- users: _id, fName, lName, phone, email,role, verified, createdAt, updatedAt
- products: _id,description,stock, name, price, category(_id of categories), status,images(Array), ,createdAt
- orders: _id, userId(_id of users), products(Array), totalAmount, status, createdAt
- categories: _id, categoryName, categoryImage ,displaytitle, featureImageUrl
- reviews: _id, productId, userId, rating, comment

Response Format:
{
  "collection": "collection_name",      // e.g. 'users', 'products'
  "query": { ... },                      // MongoDB query
  "explanation": "text explanation",     // human readable
  "type": "query" or "chart",            // what type of operation
  "options": { projection, sort, limit, aggregate } // optional
}
`;

const template = `
You are a MongoDB expert. Use this schema:
{schema}

Current date: {current_date}

Analyze this request by checking matching fields from the schema and respond in the specified JSON format:
{question}

Rules:
1. Use proper MongoDB syntax
2. Use collection names exactly as shown in the schema (e.g., 'users', 'products')
3. ONLY respond with valid JSON. No extra text or markdown.
`;


export const getPrompt = async (question) => {
  const promptTemplate = PromptTemplate.fromTemplate(template);
  return promptTemplate.format({
    schema: schemaText,
    question,
    current_date: new Date().toISOString(),
  });
};
