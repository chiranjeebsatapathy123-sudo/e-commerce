const { Op } = require('sequelize');
const { Product, Order, OrderItem, User, OrderTracking } = require('../models');

const getAnalytics = async (req, res) => {
  try {
    const validOrderCondition = {
      status: {
        [Op.notIn]: ['Cancelled', 'Failed', 'Refunded']
      }
    };

    const totalSalesResult = await Order.sum('total', { where: validOrderCondition });
    const totalSales = totalSalesResult ? parseFloat(totalSalesResult) : 0;

    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalUsers = await User.count();

    const items = await OrderItem.findAll({
      include: [{
        model: Order,
        where: validOrderCondition,
        attributes: []
      }, {
        model: Product
      }]
    });
    
    const categorySales = {};
    items.forEach(item => {
      if (item.Product) {
        const cat = item.Product.category;
        const saleAmount = parseFloat(item.price) * item.quantity;
        categorySales[cat] = (categorySales[cat] || 0) + saleAmount;
      }
    });

    const categoryData = Object.keys(categorySales).map(key => ({
      name: key,
      value: parseFloat(categorySales[key].toFixed(2))
    }));

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    res.json({
      summary: {
        totalSales,
        totalOrders,
        totalProducts,
        totalUsers
      },
      categoryData,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, price, category, stock, description, image, images } = req.body;

  try {
    const product = await Product.create({
      name,
      price,
      category,
      stock,
      description,
      image,
      images
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, price, category, stock, description, image, images } = req.body;

  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.description = description || product.description;
      product.image = image || product.image;
      product.images = images || product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      await product.destroy();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.status = status;
      await order.save();
      
      await OrderTracking.create({
        OrderId: order.id,
        status: status,
        description: `Order status updated to ${status}`,
        actor: req.user ? req.user.email : 'Admin'
      });

      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      user.role = role;
      await user.save();
      res.json({ message: 'User role updated successfully', user: { id: user.id, name: user.name, role: user.role } });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole
};
