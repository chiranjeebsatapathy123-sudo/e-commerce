const { Op } = require('sequelize');
const { Product } = require('../../models');

const getInventoryHealth = async () => {
  const products = await Product.findAll({
    attributes: ['id', 'name', 'stock', 'price', 'category']
  });

  let totalValue = 0;
  let totalUnits = 0;
  let outOfStock = 0;
  let lowStock = 0;
  let healthy = 0;

  // Assuming global threshold of 10 for low stock
  // Ideally this would be configurable per category or product
  const LOW_STOCK_THRESHOLD = 10;

  const lowStockProducts = [];
  const outOfStockProducts = [];

  products.forEach(p => {
    totalUnits += p.stock;
    totalValue += (p.stock * parseFloat(p.price));

    if (p.stock === 0) {
      outOfStock++;
      outOfStockProducts.push(p);
    } else if (p.stock <= LOW_STOCK_THRESHOLD) {
      lowStock++;
      lowStockProducts.push(p);
    } else {
      healthy++;
    }
  });

  return {
    metrics: {
      totalValue,
      totalUnits,
      outOfStock,
      lowStock,
      healthy
    },
    lowStockProducts,
    outOfStockProducts
  };
};

module.exports = {
  getInventoryHealth
};
