const { Product, Order, User, ProductRelationship } = require('../../models');

const RISK_LEVELS = {
  READ_ONLY: 'READ_ONLY',
  LOW_RISK: 'LOW_RISK',
  USER_CONFIRMATION: 'USER_CONFIRMATION',
  ADMIN_APPROVAL: 'ADMIN_APPROVAL',
  CRITICAL: 'CRITICAL'
};

const toolRegistry = {};

const registerTool = (definition) => {
  toolRegistry[definition.name] = definition;
};

// --- READ-ONLY TOOLS ---

registerTool({
  name: 'searchProducts',
  description: 'Search for products by keyword or category.',
  riskLevel: RISK_LEVELS.READ_ONLY,
  permissions: [],
  inputSchema: {
    type: 'object',
    properties: {
      keyword: { type: 'string' },
      category: { type: 'string' }
    }
  },
  execute: async (args, context) => {
    // simplified execution
    const where = {};
    if (args.keyword) {
      where.name = { $like: `%${args.keyword}%` };
    }
    if (args.category) {
      where.category = args.category;
    }
    const products = await Product.findAll({ where, limit: 5 });
    return products.map(p => ({ id: p.id, name: p.name, price: p.price, stock: p.stock }));
  }
});

registerTool({
  name: 'getProduct',
  description: 'Get full details of a specific product.',
  riskLevel: RISK_LEVELS.READ_ONLY,
  permissions: [],
  inputSchema: {
    type: 'object',
    properties: {
      productId: { type: 'string' }
    },
    required: ['productId']
  },
  execute: async (args, context) => {
    const product = await Product.findByPk(args.productId);
    return product ? product.toJSON() : { error: 'Product not found' };
  }
});

registerTool({
  name: 'getOrder',
  description: 'Get details of an order. Only accessible to the order owner or admins.',
  riskLevel: RISK_LEVELS.READ_ONLY,
  permissions: ['orders.read'], // pseudo-permission mapped to user/admin
  inputSchema: {
    type: 'object',
    properties: {
      orderId: { type: 'string' }
    },
    required: ['orderId']
  },
  execute: async (args, context) => {
    const order = await Order.findByPk(args.orderId);
    if (!order) return { error: 'Order not found' };
    
    // Authorization check
    if (context.user && context.user.role !== 'admin' && context.user.role !== 'Super Admin') {
       if (order.userId !== context.user.id) {
           return { error: 'Unauthorized to view this order' };
       }
    }
    return order.toJSON();
  }
});

// --- ADMIN_APPROVAL TOOLS ---

registerTool({
  name: 'createCampaign',
  description: 'Create a marketing campaign.',
  riskLevel: RISK_LEVELS.ADMIN_APPROVAL,
  permissions: ['admin.manage'],
  inputSchema: {
    type: 'object',
    properties: {
      campaignName: { type: 'string' },
      targetAudience: { type: 'string' }
    },
    required: ['campaignName']
  },
  execute: async (args, context) => {
    return { status: 'PENDING_APPROVAL', payload: args };
  }
});


module.exports = {
  RISK_LEVELS,
  toolRegistry,
  registerTool
};
