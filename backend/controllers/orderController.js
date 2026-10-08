const { Order, OrderItem, Product, OrderTracking, User } = require('../models');
const sequelize = require('../config/db');

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const { name, address, city, postalCode, country } = shippingAddress;

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(req.user.id);
    const isB2B = user?.isB2BClient;
    const isTaxExempt = user?.isTaxExempt;

    let calculatedSubtotal = 0;
    
    // We will build the verified items to insert later
    const itemsToCreate = [];

    for (const item of orderItems) {
      // Use lock: t.LOCK.UPDATE where supported (e.g. Postgres) to prevent race conditions
      const product = await Product.findByPk(item.id, { transaction: t, lock: t.LOCK.UPDATE });
      
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Product ${product.name} has insufficient stock` });
      }

      product.stock -= item.quantity;
      await product.save({ transaction: t });

      let unitPrice = Number(product.price);
      
      // B2B Bulk Pricing Logic
      if (isB2B && product.isB2B && product.bulkPricing && Array.isArray(product.bulkPricing)) {
        // Sort tiers by minQty descending so we check highest quantity discounts first
        const sortedTiers = [...product.bulkPricing].sort((a,b) => b.minQty - a.minQty);
        const applicableTier = sortedTiers.find(t => item.quantity >= t.minQty);
        if (applicableTier) {
          unitPrice = unitPrice * (1 - (applicableTier.discountPct / 100));
        }
      }

      calculatedSubtotal += unitPrice * item.quantity;
      
      itemsToCreate.push({
        ProductId: product.id,
        quantity: item.quantity,
        price: unitPrice, // Save the discounted unit price
        name: product.name,
        image: product.image
      });
    }

    const shipping = calculatedSubtotal > 150 ? 0 : 9.99;
    const taxRate = isTaxExempt ? 0 : 0.08; // 8% standard tax or 0% if exempt
    const tax = calculatedSubtotal * taxRate;
    const finalTotal = calculatedSubtotal + shipping + tax;

    const order = await Order.create({
      UserId: req.user.id,
      total: finalTotal,
      name,
      address,
      city,
      postalCode,
      country,
      paymentMethod,
      paymentStatus: 'Pending',
      status: 'Order Placed'
    }, { transaction: t });

    // Create initial tracking event
    await OrderTracking.create({
      OrderId: order.id,
      status: 'Order Placed',
      description: 'Order received and is pending payment confirmation.',
      actor: 'System'
    }, { transaction: t });

    // Set OrderId on the items
    for (const item of itemsToCreate) {
      item.OrderId = order.id;
    }

    await OrderItem.bulkCreate(itemsToCreate, { transaction: t });

    await t.commit();

    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: OrderTracking,
          as: 'OrderTrackings'
        }
      ],
      order: [
        [{ model: OrderTracking, as: 'OrderTrackings' }, 'createdAt', 'ASC']
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.UserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders
};
