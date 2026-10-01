const { generateText, generateStructured, getConfig } = require('../ai/aiProvider');
const { getSalesMetrics } = require('./salesAnalyticsService');
const { getInventoryHealth } = require('./inventoryAnalyticsService');
const { getDemandForecast, getStockoutRisk } = require('./forecastService');

const COPILOT_SYSTEM_PROMPT = `
You are the Spark E-Commerce Business Copilot, a secure AI assistant for store administrators.
Your job is to analyze business data and answer admin queries concisely.

CRITICAL RULES:
1. DO NOT invent metrics, sales numbers, or inventory counts.
2. Only use the structured analytics data provided in the prompt.
3. If the data is insufficient to answer the question, say so clearly.
4. Keep answers brief and professional. Provide the most critical insights first.
5. Do not execute SQL or database commands directly.
`;

const INTENT_SCHEMA = {
  type: "object",
  properties: {
    intent: { type: "string", description: "The core business question (e.g., check sales, check low stock)" },
    toolToCall: { 
      type: "string", 
      description: "The analytics tool to use: 'getSales', 'getInventory', 'getForecast', 'getStockoutRisk', or 'general'" 
    },
    dateRange: { type: "string", description: "Requested date range, e.g. '30days', '7days', 'all'" }
  }
};

const handleCopilotQuery = async (adminUser, query, history = []) => {
  const config = getConfig();
  if (!config.apiKey || config.provider === 'mock') {
    return {
      status: 'error',
      message: 'AI Provider not configured. Copilot is currently unavailable.',
      data: null
    };
  }

  try {
    // 1. Extract Intent
    const intentMessages = [
      { role: 'user', content: query }
    ];
    
    let structuredIntent;
    try {
       structuredIntent = await generateStructured(intentMessages, INTENT_SCHEMA, "Analyze the admin's question and determine which analytics tool to call.");
    } catch (e) {
       structuredIntent = { toolToCall: 'general' };
    }

    // 2. Authorize and Fetch Data based on tool
    let dataContext = '';
    let rawData = null;

    if (structuredIntent.toolToCall === 'getSales') {
      if (!['admin', 'manager', 'finance'].includes(adminUser.role)) {
        return { status: 'error', message: 'You do not have permission to view sales data.' };
      }
      
      let startDate = new Date();
      if (structuredIntent.dateRange === '7days') startDate.setDate(startDate.getDate() - 7);
      else if (structuredIntent.dateRange === '30days') startDate.setDate(startDate.getDate() - 30);
      else startDate.setDate(startDate.getDate() - 30); // default 30 days
      
      const sales = await getSalesMetrics(startDate, new Date());
      rawData = { type: 'sales', data: sales };
      dataContext = `Sales Data: Revenue ${sales.revenue}, Orders ${sales.orders}, Units Sold ${sales.unitsSold}, AOV ${sales.aov}.`;
    } 
    else if (structuredIntent.toolToCall === 'getInventory' || structuredIntent.toolToCall === 'getStockoutRisk') {
      if (!['admin', 'manager', 'inventory'].includes(adminUser.role)) {
        return { status: 'error', message: 'You do not have permission to view inventory data.' };
      }
      
      if (structuredIntent.toolToCall === 'getStockoutRisk') {
        const risks = await getStockoutRisk();
        rawData = { type: 'risks', data: risks };
        dataContext = `Stockout Risks: Found ${risks.length} products at risk. Details: ${JSON.stringify(risks.slice(0, 5))} (showing top 5).`;
      } else {
        const inventory = await getInventoryHealth();
        rawData = { type: 'inventory', data: inventory.metrics };
        dataContext = `Inventory Health: Total Units ${inventory.metrics.totalUnits}, Low Stock Items ${inventory.metrics.lowStock}, Out of Stock Items ${inventory.metrics.outOfStock}.`;
      }
    }
    else {
      // General question without specific tool call needed
      dataContext = "No specific data requested, answer generally based on system context.";
    }

    // 3. Generate Final Response
    const finalPrompt = `
      Admin Query: "${query}"
      
      Context Data retrieved from secure analytics API:
      ${dataContext}
      
      Provide a concise, professional summary answering the query using ONLY the provided data.
    `;

    const finalMessages = [
      ...history,
      { role: 'user', content: finalPrompt }
    ];

    const aiResponse = await generateText(finalMessages, COPILOT_SYSTEM_PROMPT);

    return {
      status: 'success',
      message: aiResponse,
      data: rawData
    };

  } catch (err) {
    console.error('Error in handleCopilotQuery:', err);
    return {
      status: 'error',
      message: 'Business Copilot encountered an error analyzing your request.',
      data: null
    };
  }
};

module.exports = {
  handleCopilotQuery
};
