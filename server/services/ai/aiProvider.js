// server/services/ai/aiProvider.js
const axios = require('axios');
const modelRouter = require('./modelRouter');
const costIntel = require('./costIntelligence');

const getConfig = () => ({
  provider: process.env.AI_PROVIDER || 'mock',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'gpt-3.5-turbo',
  baseUrl: process.env.AI_BASE_URL,
  maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 500,
  temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7
});

/**
 * Abstraction for generating text
 */
const generateText = async (messages, systemPrompt = '') => {
  const config = getConfig();

  if (!config.apiKey || config.provider === 'mock') {
    throw new Error('AI_PROVIDER_NOT_CONFIGURED');
  }

  // Very basic abstraction for OpenAI-like endpoints
  try {
    const payload = {
      model: config.model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens
    };

    const response = await axios.post(
      config.baseUrl || 'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15s timeout
      }
    );

    const routedModel = modelRouter.route({ type: 'chat' });
    
    // Simulate token counts for cost tracking
    const inputTokens = JSON.stringify(messages).length / 4;
    const outputTokens = (response.data.choices[0].message.content || '').length / 4;
    costIntel.track(routedModel.id, 'generateText', inputTokens, outputTokens, routedModel.costPer1k);

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('[AI Provider Error]:', err.message);
    throw new Error('AI_PROVIDER_ERROR');
  }
};

/**
 * Abstraction for generating structured output (JSON)
 */
const generateStructured = async (messages, schema, systemPrompt = '') => {
  const config = getConfig();

  if (!config.apiKey || config.provider === 'mock') {
    throw new Error('AI_PROVIDER_NOT_CONFIGURED');
  }

  try {
    const payload = {
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt + '\nRespond ONLY with valid JSON matching the requested schema.' },
        ...messages
      ],
      temperature: 0.1, // Low temp for structured
      max_tokens: config.maxTokens,
      response_format: { type: 'json_object' }
    };

    const response = await axios.post(
      config.baseUrl || 'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const routedModel = modelRouter.route({ type: 'structured' });

    const content = response.data.choices[0].message.content;

    // Simulate token counts for cost tracking
    const inputTokens = JSON.stringify(messages).length / 4;
    const outputTokens = content.length / 4;
    costIntel.track(routedModel.id, 'generateStructured', inputTokens, outputTokens, routedModel.costPer1k);

    return JSON.parse(content);
  } catch (err) {
    console.error('[AI Provider Error - Structured]:', err.message);
    throw new Error('AI_PROVIDER_ERROR');
  }
};

module.exports = {
  generateText,
  generateStructured,
  getConfig
};
