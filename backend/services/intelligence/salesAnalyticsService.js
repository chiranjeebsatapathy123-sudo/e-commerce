const { Op } = require('sequelize');
const { Order, OrderItem, Product } = require('../../models');

const getSalesMetrics = async (startDate, endDate) => {
  const where = {
    status: {
      [Op.notIn]: ['Cancelled', 'Failed', 'Refunded']
    }
  };

  if (startDate && endDate) {
    where.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }

  const orders = await Order.findAll({
    where,
    attributes: ['id', 'total', 'createdAt'],
    include: [{
      model: OrderItem,
      attributes: ['quantity', 'price'],
      include: [{
        model: Product,
        attributes: ['category']
      }]
    }]
  });

  let totalRevenue = 0;
  let totalOrders = orders.length;
  let totalUnits = 0;
  const categorySales = {};
  
  // Aggregate revenue per day for trend line
  const trend = {};

  orders.forEach(order => {
    totalRevenue += parseFloat(order.total);
    
    const day = order.createdAt.toISOString().split('T')[0];
    trend[day] = (trend[day] || 0) + parseFloat(order.total);

    order.OrderItems.forEach(item => {
      totalUnits += item.quantity;
      if (item.Product) {
        const cat = item.Product.category;
        const lineTotal = parseFloat(item.price) * item.quantity;
        categorySales[cat] = (categorySales[cat] || 0) + lineTotal;
      }
    });
  });

  const aov = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  return {
    revenue: totalRevenue,
    orders: totalOrders,
    unitsSold: totalUnits,
    aov,
    categorySales,
    trend: Object.keys(trend).sort().map(date => ({ date, revenue: trend[date] }))
  };
};

module.exports = {
  getSalesMetrics
};
