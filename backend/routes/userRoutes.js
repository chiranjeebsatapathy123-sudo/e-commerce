const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, syncCart, getWishlist, syncWishlist } = require('../controllers/userController');

router.get('/cart', protect, getCart);
router.post('/cart/sync', protect, syncCart);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/sync', protect, syncWishlist);

module.exports = router;
