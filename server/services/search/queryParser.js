const { generateStructured } = require('../ai/aiProvider');

const SEARCH_INTENT_SCHEMA = {
  type: "object",
  properties: {
    query: { type: "string" },
    category: { type: "string", description: "Inferred category e.g. Electronics, Fashion, Home" },
    brand: { type: "string" },
    minPrice: { type: "number" },
    maxPrice: { type: "number" },
    color: { type: "string" },
    attributes: { type: "array", items: { type: "string" } },
    sort: { type: "string", description: "priceAsc, priceDesc, rating, or null" }
  }
};

const parseQueryWithAI = async (rawQuery) => {
  try {
    const messages = [{ role: 'user', content: `Parse this search query into structured filters: "${rawQuery}"` }];
    const parsed = await generateStructured(
      messages, 
      SEARCH_INTENT_SCHEMA, 
      "Extract structured search constraints from the user's natural language query."
    );
    return parsed;
  } catch (err) {
    console.log('AI parsing failed, falling back to basic extraction.', err.message);
    return basicKeywordExtraction(rawQuery);
  }
};

const basicKeywordExtraction = (rawQuery) => {
  const result = { query: rawQuery, attributes: [] };
  
  // Basic naive extraction
  const lowerQuery = rawQuery.toLowerCase();
  
  if (lowerQuery.includes('under ') || lowerQuery.includes('<')) {
    const match = lowerQuery.match(/(?:under|<)\s*(\d+)/);
    if (match) result.maxPrice = parseInt(match[1]);
  }
  
  if (lowerQuery.includes('cheap')) {
    result.sort = 'priceAsc';
  }
  
  if (lowerQuery.includes('best') || lowerQuery.includes('top rated')) {
    result.sort = 'rating';
  }
  
  return result;
};

module.exports = {
  parseQueryWithAI,
  basicKeywordExtraction
};
