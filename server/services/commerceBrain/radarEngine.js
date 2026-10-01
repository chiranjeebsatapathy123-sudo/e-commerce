const { ShoppingRadarItem, Product } = require('../../models');

const getRadarItems = async (userId) => {
  const items = await ShoppingRadarItem.findAll({ where: { userId } });
  
  // Hydrate with products
  const populated = [];
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (product) {
      populated.push({
        ...item.toJSON(),
        product
      });
    }
  }
  
  return populated;
};

const addToRadar = async (userId, productId, targetPrice, notifyOnRestock, notifyOnPriceDrop) => {
  const existing = await ShoppingRadarItem.findOne({ where: { userId, productId } });
  if (existing) {
    return await existing.update({ targetPrice, notifyOnRestock, notifyOnPriceDrop });
  }

  return await ShoppingRadarItem.create({
    userId,
    productId,
    targetPrice,
    notifyOnRestock,
    notifyOnPriceDrop
  });
};

const removeFromRadar = async (id, userId) => {
  const item = await ShoppingRadarItem.findOne({ where: { id, userId } });
  if (item) {
    await item.destroy();
  }
};

module.exports = {
  getRadarItems,
  addToRadar,
  removeFromRadar
};
