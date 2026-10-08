const { registerAgent } = require('./agentRegistry');
const { generateChatResponse, parseJSON } = require('../ai/aiProvider');

const SupportAgent = {
  name: 'SupportAgent',
  systemPrompt: `
    You are the Support Agent. Your job is to help users with policies and general issues.
    Output JSON: { "answer": "...", "confidence": 0.0-1.0 }
  `,
  process: async (userRequest, context, toolRegistry, history) => {
    const prompt = `
      ${SupportAgent.systemPrompt}
      User Request: "${userRequest}"
      (No tools implemented for SupportAgent yet)
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

registerAgent(SupportAgent);
module.exports = SupportAgent;
