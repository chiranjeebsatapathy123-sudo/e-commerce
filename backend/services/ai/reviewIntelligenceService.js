const { aiProvider } = require('./aiProvider');
const { Review, Product, ProductReviewAnalysis } = require('../../models');

const analyzeReviews = async (productId) => {
  try {
    // 1. Fetch all approved reviews for this product
    const reviews = await Review.findAll({
      where: { ProductId: productId, status: 'Approved' },
      attributes: ['rating', 'comment', 'isVerifiedPurchase', 'createdAt']
    });

    if (!reviews || reviews.length === 0) {
      return null;
    }

    // 2. Check if we have enough text to analyze (e.g., at least 3 text reviews)
    const textReviews = reviews.filter(r => r.comment && r.comment.trim().length > 10);
    if (textReviews.length < 3) {
      // Not enough text for reliable AI
      return { insufficientData: true };
    }

    // 3. Format the reviews for the AI
    const reviewsText = textReviews.map((r, i) => `Review ${i+1} [Rating: ${r.rating}/5, Verified: ${r.isVerifiedPurchase}]: ${r.comment}`).join('\n\n');
    
    // 4. Construct AI Prompt
    const prompt = `You are an AI Review Intelligence engine for an e-commerce platform.
Analyze the following customer reviews for a product and extract key insights.
Return ONLY a valid JSON object matching this exact schema:

{
  "summary": {
    "positive": ["Theme 1", "Theme 2"], // max 3 short bullet points
    "negative": ["Theme 1", "Theme 2"]  // max 3 short bullet points
  },
  "sentimentDistribution": {
    "positive": 80, // integer percentage 0-100
    "neutral": 10,  // integer percentage 0-100
    "negative": 10  // integer percentage 0-100
  },
  "themes": {
    "Battery": 85, // Theme name string as key, integer percentage of how many reviews mention it positively/neutrally
    "Comfort": 60
  }
}

Do NOT invent features that are not explicitly mentioned in the reviews.
If there are no negative themes, leave the array empty.

Reviews:
${reviewsText}
`;

    // 5. Call AI
    const aiResponse = await aiProvider.generateResponse([{ role: 'user', content: prompt }]);
    
    // Extract JSON safely
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Failed to parse JSON from AI review analysis");
    }
    
    const analysis = JSON.parse(jsonMatch[0]);

    // 6. Save or update analysis
    const [record, created] = await ProductReviewAnalysis.findOrCreate({
      where: { ProductId: productId },
      defaults: {
        summary: analysis.summary,
        sentimentDistribution: analysis.sentimentDistribution,
        themes: analysis.themes,
        analyzedReviewCount: reviews.length,
        isStale: false
      }
    });

    if (!created) {
      record.summary = analysis.summary;
      record.sentimentDistribution = analysis.sentimentDistribution;
      record.themes = analysis.themes;
      record.analyzedReviewCount = reviews.length;
      record.isStale = false;
      await record.save();
    }

    return record;
  } catch (error) {
    console.error(`Error analyzing reviews for product ${productId}:`, error);
    return null;
  }
};

const getProductReviewAnalysis = async (productId) => {
    let analysis = await ProductReviewAnalysis.findOne({ where: { ProductId: productId } });
    
    // If no analysis exists or it is stale, run analysis asynchronously (do not block)
    // To ensure responsiveness, we'll return what we have (even if stale or null) and let the background job update it.
    if (!analysis || analysis.isStale) {
        // Run async
        analyzeReviews(productId).catch(e => console.error("Background review analysis failed:", e));
    }
    
    return analysis;
};

const askAboutProduct = async (productId, question) => {
    try {
        const product = await Product.findByPk(productId);
        if (!product) return { error: "Product not found" };

        const reviews = await Review.findAll({
            where: { ProductId: productId, status: 'Approved' },
            limit: 20, // Limit context size
            order: [['rating', 'DESC']] // A mix of good and maybe some bad if we sorted differently, but let's just get 20
        });

        const reviewsContext = reviews.filter(r => r.comment).map(r => `Rating ${r.rating}/5: ${r.comment}`).join('\n\n');

        const prompt = `You are a Smart Buying Assistant for an e-commerce platform.
The user is asking a question about a specific product.
You must answer ONLY using the provided Product Data and Customer Reviews.
If the answer cannot be determined from the provided data, you MUST say "I couldn't verify that from the available product information."
Do not invent specifications.
Keep the answer concise and helpful.

Product Data:
Name: ${product.name}
Category: ${product.category}
Price: $${product.price}
Description: ${product.description || 'Not specified'}

Customer Reviews (sample):
${reviewsContext || 'No text reviews available.'}

User Question: ${question}

Return your response as a strict JSON object:
{
  "answer": "Your concise factual answer here.",
  "claims": ["Factual claim 1", "Factual claim 2"],
  "evidence": ["Excerpt from description or review supporting the claim"],
  "confidence": "High/Medium/Low",
  "missingInformation": ["Any requested details not found in data"],
  "sourceType": "product_data_and_reviews"
}`;

        const aiResponse = await aiProvider.generateResponse([{ role: 'user', content: prompt }]);
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { answer: aiResponse, sourceType: "fallback" };

    } catch (err) {
        console.error("Error asking about product:", err);
        return { answer: "I'm sorry, I encountered an error while fetching that information." };
    }
}

const compareProducts = async (productIds) => {
     try {
         const products = await Product.findAll({ where: { id: productIds } });
         
         const productContexts = products.map(p => `
Product ${p.id}:
Name: ${p.name}
Price: $${p.price}
Category: ${p.category}
Rating: ${p.rating} (${p.reviewsCount} reviews)
Description: ${p.description}
         `).join('\n\n');

         const prompt = `You are a Smart Comparison Engine. Compare the provided products factually.
Highlight the key differences in price, rating, and features based strictly on the provided descriptions.
Do NOT declare one product universally better than another; instead, explain which use-case might prefer which product.
Keep it concise.

Products to compare:
${productContexts}

Provide a short paragraph explaining the factual differences.`;

        const explanation = await aiProvider.generateResponse([{ role: 'user', content: prompt }]);
        
        return {
            products,
            explanation
        };
     } catch (err) {
         console.error("Comparison error:", err);
         return { error: "Failed to compare products" };
     }
};

module.exports = {
  analyzeReviews,
  getProductReviewAnalysis,
  askAboutProduct,
  compareProducts
};
