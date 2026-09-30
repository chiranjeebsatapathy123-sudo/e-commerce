const { Product, ProductEmbedding } = require('../../models');
const { generateStructured } = require('../ai/aiProvider');

// Simple cosine similarity fallback if pgvector is not available
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Generate a mock embedding based on hashing product string just to simulate an embedding vector.
 * In a real environment, this would call `createEmbedding()` from the AI provider.
 */
const generateMockEmbedding = (text) => {
  const vec = new Array(1536).fill(0);
  for(let i=0; i<text.length; i++) {
    vec[i % 1536] += text.charCodeAt(i) / 255.0;
  }
  // Normalize
  let norm = 0;
  vec.forEach(v => norm += v*v);
  norm = Math.sqrt(norm);
  if(norm > 0) return vec.map(v => v / norm);
  return vec;
};

const getProductEmbedding = async (productId) => {
  let embeddingRecord = await ProductEmbedding.findOne({ where: { ProductId: productId } });
  
  if (!embeddingRecord || embeddingRecord.isStale) {
    const product = await Product.findByPk(productId);
    if (!product) return null;

    const content = `${product.name} ${product.category} ${product.description}`;
    const vector = generateMockEmbedding(content);

    if (embeddingRecord) {
      embeddingRecord.embedding = vector;
      embeddingRecord.isStale = false;
      embeddingRecord.lastEmbeddedAt = new Date();
      await embeddingRecord.save();
    } else {
      embeddingRecord = await ProductEmbedding.create({
        ProductId: productId,
        embedding: vector,
        isStale: false,
        lastEmbeddedAt: new Date()
      });
    }
  }

  return embeddingRecord.embedding;
};

const findSimilarProducts = async (targetProductId, limit = 5) => {
  const targetEmbedding = await getProductEmbedding(targetProductId);
  if (!targetEmbedding) return [];

  // In production with pgvector this is a single SQL query. 
  // Here we do a fallback in-memory search for the mock implementation.
  const allEmbeddings = await ProductEmbedding.findAll({
    where: { isStale: false },
    include: [{ model: Product }]
  });

  const scores = allEmbeddings
    .filter(e => e.ProductId !== parseInt(targetProductId))
    .map(e => ({
      product: e.Product,
      score: cosineSimilarity(targetEmbedding, e.embedding)
    }));

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, limit);
};

const semanticSearch = async (queryText, limit = 10) => {
  const queryVector = generateMockEmbedding(queryText);
  
  const allEmbeddings = await ProductEmbedding.findAll({
    where: { isStale: false },
    include: [{ model: Product }]
  });

  const scores = allEmbeddings
    .map(e => ({
      product: e.Product,
      score: cosineSimilarity(queryVector, e.embedding)
    }));

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, limit);
};

module.exports = {
  getProductEmbedding,
  findSimilarProducts,
  semanticSearch,
  cosineSimilarity
};
