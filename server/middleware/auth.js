const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (!process.env.JWT_SECRET) {
        console.error('CRITICAL: JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ message: 'Internal Server Error: Authentication configuration missing' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const ROLE_PERMISSIONS = {
  CUSTOMER: [],
  SUPPORT_AGENT: ['orders.read', 'products.read', 'users.read'],
  INVENTORY_MANAGER: ['products.read', 'products.create', 'products.update', 'inventory.read', 'inventory.update'],
  ORDER_MANAGER: ['orders.read', 'orders.update', 'refunds.create'],
  MARKETING_MANAGER: ['products.read', 'analytics.read', 'marketing.create'],
  FINANCE_MANAGER: ['analytics.read', 'orders.read', 'refunds.create'],
  ADMIN: ['products.read', 'products.create', 'products.update', 'products.delete', 'inventory.read', 'inventory.update', 'orders.read', 'orders.update', 'refunds.create', 'users.read', 'users.update', 'analytics.read', 'marketing.create', 'admin.manage'],
  SUPER_ADMIN: ['*'] // wildcard permission
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Normalize role string format to match uppercase mapping
    const userRole = (req.user.role || 'CUSTOMER').toUpperCase().replace(' ', '_');
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({ message: `Forbidden: requires ${permission} permission` });
  };
};

module.exports = { protect, requirePermission, ROLE_PERMISSIONS };
