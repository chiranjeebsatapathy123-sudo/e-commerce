const { Op } = require('sequelize');
const { Order, OrderItem, Product } = require('../../models');

const getDemandForecast = async (productId, daysToForecast = 7) => {
  // Simple moving average over the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const items = await OrderItem.findAll({
    where: { ProductId: productId },
    include: [{
      model: Order,
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo },
        status: { [Op.notIn]: ['Cancelled', 'Failed', 'Refunded'] }
      },
      attributes: ['createdAt']
    }]
  });

  if (items.length < 5) {
    return {
      status: 'insufficient_data',
      message: 'Insufficient historical data for reliable forecasting.',
      averageDailyDemand: 0,
      forecast: 0
    };
  }

  let totalDemand = 0;
  items.forEach(item => {
    totalDemand += item.quantity;
  });

  // Calculate daily average over 30 days
  const averageDailyDemand = totalDemand / 30;
  const forecast = Math.round(averageDailyDemand * daysToForecast);

  return {
    status: 'success',
    averageDailyDemand: parseFloat(averageDailyDemand.toFixed(2)),
    forecast: forecast
  };
};

const getStockoutRisk = async () => {
  const products = await Product.findAll({
    attributes: ['id', 'name', 'stock', 'price']
  });

  const risks = [];

  for (const product of products) {
    const forecastObj = await getDemandForecast(product.id);
    
    if (forecastObj.status === 'success' && forecastObj.averageDailyDemand > 0) {
      const estimatedDaysRemaining = Math.floor(product.stock / forecastObj.averageDailyDemand);
      let severity = 'Low';
      if (estimatedDaysRemaining <= 7) severity = 'Critical';
      else if (estimatedDaysRemaining <= 14) severity = 'Warning';

      if (severity !== 'Low' || product.stock === 0) {
        risks.push({
          productId: product.id,
          name: product.name,
          currentStock: product.stock,
          averageDailyDemand: forecastObj.averageDailyDemand,
          estimatedDaysRemaining,
          severity
        });
      }
    }
  }

  return risks.sort((a, b) => a.estimatedDaysRemaining - b.estimatedDaysRemaining);
};

module.exports = {
  getDemandForecast,
  getStockoutRisk
};
