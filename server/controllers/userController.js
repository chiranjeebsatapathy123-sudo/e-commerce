const { CartItem, WishlistItem, Product } = require('../models');

const getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { UserId: req.user.id },
      include: [Product]
    });
    
    // Format to match frontend structure
    const formattedCart = cartItems.map(item => ({
      ...item.Product.toJSON(),
      quantity: item.quantity
    }));
    
    res.json(formattedCart);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

const syncCart = async (req, res) => {
  try {
    const { cart } = req.body; // Array of items [{ id: ProductId, quantity }]
    
    // Merge logic: for simplicity, we just clear and re-insert or properly upsert
    await CartItem.destroy({ where: { UserId: req.user.id } });
    
    if (cart && cart.length > 0) {
      const itemsToCreate = cart.map(item => ({
        UserId: req.user.id,
        ProductId: item.id,
        quantity: item.quantity
      }));
      await CartItem.bulkCreate(itemsToCreate);
    }
    
    res.json({ success: true, message: 'Cart synchronized' });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.findAll({
      where: { UserId: req.user.id },
      include: [Product]
    });
    
    const formattedWishlist = wishlistItems.map(item => item.Product.toJSON());
    
    res.json(formattedWishlist);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

const syncWishlist = async (req, res) => {
  try {
    const { wishlist } = req.body; // Array of items [{ id: ProductId }]
    
    await WishlistItem.destroy({ where: { UserId: req.user.id } });
    
    if (wishlist && wishlist.length > 0) {
      const itemsToCreate = wishlist.map(item => ({
        UserId: req.user.id,
        ProductId: item.id
      }));
      await WishlistItem.bulkCreate(itemsToCreate);
    }
    
    res.json({ success: true, message: 'Wishlist synchronized' });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

module.exports = { getCart, syncCart, getWishlist, syncWishlist };
