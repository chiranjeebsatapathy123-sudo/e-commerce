const { ShoppingDecisionWorkspace } = require('../../models');

const getWorkspaces = async (userId) => {
  return await ShoppingDecisionWorkspace.findAll({ where: { userId } });
};

const createWorkspace = async (userId, title, productIds = []) => {
  return await ShoppingDecisionWorkspace.create({
    userId,
    title,
    productIds: JSON.stringify(productIds)
  });
};

const updateWorkspace = async (id, userId, updates) => {
  const workspace = await ShoppingDecisionWorkspace.findOne({ where: { id, userId } });
  if (!workspace) throw new Error('Workspace not found');
  
  if (updates.productIds) {
    updates.productIds = JSON.stringify(updates.productIds);
  }
  
  await workspace.update(updates);
  return workspace;
};

const deleteWorkspace = async (id, userId) => {
  const workspace = await ShoppingDecisionWorkspace.findOne({ where: { id, userId } });
  if (workspace) {
    await workspace.destroy();
  }
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
};
