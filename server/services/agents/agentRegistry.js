const registry = {};

const registerAgent = (agentDef) => {
  if (!agentDef.name || !agentDef.systemPrompt || !agentDef.process) {
    throw new Error('Invalid agent definition');
  }
  registry[agentDef.name] = agentDef;
};

const getAgent = (name) => {
  return registry[name];
};

const getAllAgents = () => {
  return Object.values(registry);
};

module.exports = {
  registerAgent,
  getAgent,
  getAllAgents
};
