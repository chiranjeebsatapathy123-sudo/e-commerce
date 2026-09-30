const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const OrderTracking = require('./OrderTracking');
const CartItem = require('./CartItem');
const WishlistItem = require('./WishlistItem');
const ProductEmbedding = require('./ProductEmbedding');
const SearchQuery = require('./SearchQuery');
const UserInteraction = require('./UserInteraction');
const ProductReviewAnalysis = require('./ProductReviewAnalysis');

// User and Order
User.hasMany(Order, { onDelete: 'CASCADE' });
Order.belongsTo(User);

// User and Review
User.hasMany(Review, { onDelete: 'CASCADE' });
Review.belongsTo(User);

// Product and Review
Product.hasMany(Review, { onDelete: 'CASCADE' });
Review.belongsTo(Product);

// Product and ReviewAnalysis
Product.hasOne(ProductReviewAnalysis, { onDelete: 'CASCADE' });
ProductReviewAnalysis.belongsTo(Product);

// Order and OrderItem
Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

// Product and OrderItem
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Order and OrderTracking
Order.hasMany(OrderTracking, { onDelete: 'CASCADE' });
OrderTracking.belongsTo(Order);

// User and CartItem
User.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(User);

// Product and CartItem
Product.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(Product);

// User and WishlistItem
User.hasMany(WishlistItem, { onDelete: 'CASCADE' });
WishlistItem.belongsTo(User);

// Product and WishlistItem
Product.hasMany(WishlistItem, { onDelete: 'CASCADE' });
WishlistItem.belongsTo(Product);

// Product and Embeddings
Product.hasOne(ProductEmbedding, { onDelete: 'CASCADE' });
ProductEmbedding.belongsTo(Product);

// User and Interactions
User.hasMany(UserInteraction, { onDelete: 'CASCADE' });
UserInteraction.belongsTo(User);

Product.hasMany(UserInteraction, { onDelete: 'CASCADE' });
UserInteraction.belongsTo(Product);

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  Review,
  OrderTracking,
  CartItem,
  WishlistItem,
  ProductEmbedding,
  SearchQuery,
  UserInteraction,
  ProductReviewAnalysis
};
