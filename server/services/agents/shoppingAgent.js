const { registerAgent } = require('./agentRegistry');
const { generateChatResponse, parseJSON } = require('../ai/aiProvider');

const ShoppingAgent = {
  name: 'ShoppingAgent',
  systemPrompt: `
    You are the Shopping Agent. Your job is to understand the user's intent, search for products, shortlist them, and provide recommendations.
    You must output a JSON object with:
    {
      "intent": "identified intent",
      "toolToCall": "searchProducts",
      "toolArgs": { "keyword": "...", "category": "..." },
      "answer": "your conversational response",
      "confidence": 0.0-1.0
    }
  `,
  process: async (userRequest, context, toolRegistry, history) => {
    // Phase 1: Intent & Tool Selection
    const prompt = `
      ${ShoppingAgent.systemPrompt}
      
      User Request: "${userRequest}"
      
      If you need to search for products, set toolToCall to 'searchProducts'.
      If you just want to answer generally, leave toolToCall empty.
    `;
    
    const llmResponse = await generateChatResponse([{ role: 'system', content: prompt }]);
    let parsed;
    try {
      parsed = parseJSON(llmResponse) || {};
    } catch(e) {
      parsed = { answer: "I couldn't process your request.", confidence: 0 };
    }

    const result = {
       answer: parsed.answer,
       confidence: parsed.confidence || 0.5,
       toolsCalled: []
    };

    // Phase 2: Tool Execution (if needed)
    if (parsed.toolToCall && toolRegistry[parsed.toolToCall]) {
       const tool = toolRegistry[parsed.toolToCall];
       // Check permissions
       const userRole = context?.user?.role || 'user';
       // We'd do a real permission check here
       
       if (tool.riskLevel === 'READ_ONLY' || tool.riskLevel === 'LOW_RISK') {
         const toolResult = await tool.execute(parsed.toolArgs || {}, context);
         result.toolsCalled.push({ name: tool.name, result: toolResult });
         
         // Extract product IDs if the tool returned products
         const productIds = [];
         if (Array.isArray(toolResult)) {
           toolResult.forEach(item => { if (item.id) productIds.push(item.id); });
         } else if (toolResult && toolResult.id) {
           productIds.push(toolResult.id);
         }
         result.products = productIds;
         
         // Phase 3: Synthesize result
         const synthesizePrompt = `
           You are the Shopping Agent.
           User asked: "${userRequest}"
           Tool returned: ${JSON.stringify(toolResult)}
           Provide a helpful, friendly response summarizing the results without listing URLs or raw IDs.
         `;
         const finalAnswer = await generateChatResponse([{ role: 'system', content: synthesizePrompt }]);
         result.answer = finalAnswer;
         result.confidence = 0.9;
       } else {
         result.answer = "I need permission to execute that action.";
         result.confidence = 0.1;
       }
    }

    return result;
  }
};

registerAgent(ShoppingAgent);

module.exports = ShoppingAgent;
