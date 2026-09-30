const { Product, Review, User, Order, ProductReviewAnalysis } = require('../models');
const { Op } = require('sequelize');

const getProducts = async (req, res) => {
  try {
    const { keyword, category, sort, page = 1, limit = 8 } = req.query;
    const offset = (page - 1) * limit;

    const queryOptions = {
      where: {},
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    if (keyword) {
      queryOptions.where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (category && category !== 'All') {
      queryOptions.where.category = category;
    }

    if (sort) {
      if (sort === 'priceAsc') {
        queryOptions.order = [['price', 'ASC']];
      } else if (sort === 'priceDesc') {
        queryOptions.order = [['price', 'DESC']];
      } else if (sort === 'rating') {
        queryOptions.order = [['rating', 'DESC']];
      } else {
        queryOptions.order = [['createdAt', 'DESC']];
      }
    } else {
      queryOptions.order = [['createdAt', 'DESC']];
    }

    const { count, rows } = await Product.findAndCountAll(queryOptions);

    res.json({
      products: rows,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          where: { status: 'Approved' },
          required: false,
          include: [
            {
              model: User,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user.id;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      where: { ProductId: productId, UserId: userId }
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Check if user actually bought it
    const hasBought = await Order.findOne({
      where: { UserId: userId, status: 'Delivered' },
      include: [{
        association: 'OrderItems',
        where: { ProductId: productId }
      }]
    });
    
    // Very basic spam filter simulation - real AI moderation happens offline/async
    let status = 'Approved';
    let flaggedReason = null;
    if (comment && comment.length > 500) {
      status = 'Pending';
      flaggedReason = 'Unusually long review, pending AI moderation';
    }

    await Review.create({
      rating: parseInt(rating),
      comment,
      ProductId: productId,
      UserId: userId,
      isVerifiedPurchase: !!hasBought,
      status,
      flaggedReason
    });

    const reviews = await Review.findAll({ where: { ProductId: productId, status: 'Approved' } });
    const reviewsCount = reviews.length;
    const avgRating = reviewsCount > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviewsCount : 0;

    product.reviewsCount = reviewsCount;
    product.rating = parseFloat(avgRating.toFixed(1));
    await product.save();
    
    // Invalidate AI Analysis Cache
    await ProductReviewAnalysis.update({ isStale: true }, { where: { ProductId: productId } });

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductReview
};
