// Initialize tools
require('./agentTools');

// Initialize agents (which register themselves in the registry)
require('./shoppingAgent');
require('./orderAgent');
require('./supportAgent');
require('./adminAgent');

// Export Orchestrator
const orchestrator = require('./agentOrchestrator');
module.exports = orchestrator;
