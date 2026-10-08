const { registerAgent } = require('./agentRegistry');
const { generateChatResponse, parseJSON } = require('../ai/aiProvider');

const OrderAgent = {
  name: 'OrderAgent',
  systemPrompt: `
    You are the Order Agent. Your job is to help users with their orders.
    You must output a JSON object with:
    {
      "intent": "identified intent",
      "toolToCall": "getOrder",
      "toolArgs": { "orderId": "..." },
      "answer": "your conversational response",
      "confidence": 0.0-1.0
    }
  `,
  process: async (userRequest, context, toolRegistry, history) => {
    const prompt = `
      ${OrderAgent.systemPrompt}
      
      User Request: "${userRequest}"
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

    if (parsed.toolToCall && toolRegistry[parsed.toolToCall]) {
       const tool = toolRegistry[parsed.toolToCall];
       // Check permissions
       if (tool.riskLevel === 'READ_ONLY' || tool.riskLevel === 'LOW_RISK') {
         const toolResult = await tool.execute(parsed.toolArgs || {}, context);
         result.toolsCalled.push({ name: tool.name, result: toolResult });
         
         const synthesizePrompt = `
           You are the Order Agent.
           User asked: "${userRequest}"
           Tool returned: ${JSON.stringify(toolResult)}
           Provide a helpful, friendly response based on the tool result.
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

registerAgent(OrderAgent);

module.exports = OrderAgent;
