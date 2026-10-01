const { getAgent } = require('./agentRegistry');
const { toolRegistry } = require('./agentTools');
const { generateChatResponse, parseJSON } = require('../ai/aiProvider');
const trustEngine = require('../trust/trustEngine');

// Central router/orchestrator
class AgentOrchestrator {
  constructor() {
    this.history = [];
  }

  async handleRequest(userRequest, context) {
    // 1. Determine which agent should handle this based on intent
    const routerPrompt = `
      You are the Commerce OS Orchestrator.
      Analyze the user request: "${userRequest}"
      Determine the best agent to handle this.
      Available Agents: 
      - ShoppingAgent: For finding, comparing, and discovering products.
      - OrderAgent: For checking order status, tracking, and refunds.
      - SupportAgent: For policies, returns, and issues.
      - AdminAgent: For catalogue health, sales analytics, and business insights.
      
      Respond with ONLY the agent name.
    `;
    
    // In a real implementation we would call LLM here to route.
    // Let's default to ShoppingAgent for now.
    let selectedAgentName = 'ShoppingAgent';
    
    if (userRequest.toLowerCase().includes('order') || userRequest.toLowerCase().includes('track')) {
      selectedAgentName = 'OrderAgent';
    } else if (userRequest.toLowerCase().includes('policy') || userRequest.toLowerCase().includes('return')) {
      selectedAgentName = 'SupportAgent';
    } else if (userRequest.toLowerCase().includes('analyze') && context?.user?.role === 'admin') {
      selectedAgentName = 'AdminAgent';
    }

    const agent = getAgent(selectedAgentName);
    if (!agent) {
       return { answer: "I couldn't find an appropriate agent to handle your request.", confidence: 0 };
    }

    // 2. Execute agent process
    try {
      const result = await agent.process(userRequest, context, toolRegistry, this.history);
      
      // 3. Central Trust & Decision Gate
      const trustContext = {
        intent: userRequest,
        evidenceList: result.evidence || [],
        userRole: context?.user?.role || 'user',
      };
      const trustEvaluation = trustEngine.evaluate(trustContext);
      
      // Gate the response based on policy
      let finalAnswer = result.answer;
      if (trustEvaluation.decision === 'REFUSE') {
         finalAnswer = "I cannot fulfill this request due to security or policy constraints.";
      } else if (trustEvaluation.decision === 'REQUIRE_ADMIN_APPROVAL') {
         finalAnswer = "This action requires administrator approval. I have logged the request.";
      } else if (trustEvaluation.decision === 'REQUIRE_CONFIRMATION') {
         finalAnswer = result.answer + "\n\nPlease confirm if you would like to proceed.";
      } else if (trustEvaluation.decision === 'VERIFY') {
         finalAnswer = "I found some information, but you may want to verify it: " + result.answer;
      } else if (trustEvaluation.decision === 'DELEGATE') {
         finalAnswer = "I'm not entirely sure about that. Let me connect you with a human representative.";
      }
      
      // 4. Track trace
      const trace = {
         request: userRequest,
         agent: selectedAgentName,
         confidence: trustEvaluation.trustProfile.confidence,
         decision: trustEvaluation.decision,
         toolsCalled: result.toolsCalled || []
      };

      return {
        ...result,
        answer: finalAnswer,
        confidence: trustEvaluation.trustProfile.confidence,
        trustProfile: trustEvaluation.trustProfile
      };
    } catch (e) {
       console.error(`Agent error [${selectedAgentName}]:`, e);
       return { answer: "There was a system error processing your request.", confidence: 0, error: e.message };
    }
  }
}

module.exports = new AgentOrchestrator();
