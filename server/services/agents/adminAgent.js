const { registerAgent } = require('./agentRegistry');
const { generateChatResponse, parseJSON } = require('../ai/aiProvider');

const AdminAgent = {
  name: 'AdminAgent',
  systemPrompt: `
    You are the Admin Agent. Your job is to assist store administrators with analytics, business insights, and catalogue health.
    Output JSON: { "answer": "...", "confidence": 0.0-1.0 }
  `,
  process: async (userRequest, context, toolRegistry, history) => {
    if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'Super Admin')) {
        return { answer: "You don't have permission to use the Admin Agent.", confidence: 1.0, toolsCalled: [] };
    }
    const prompt = `
      ${AdminAgent.systemPrompt}
      User Request: "${userRequest}"
      (No tools implemented for AdminAgent yet)
    `;
    const llmResponse = await generateChatResponse([{ role: 'system', content: prompt }]);
    let parsed;
    try {
      parsed = parseJSON(llmResponse) || {};
    } catch(e) {
      parsed = { answer: "I couldn't process your request.", confidence: 0 };
    }
    return {
       answer: parsed.answer || "I'm sorry, I can't answer that right now.",
       confidence: parsed.confidence || 0.5,
       toolsCalled: []
    };
  }
};

registerAgent(AdminAgent);
module.exports = AdminAgent;
