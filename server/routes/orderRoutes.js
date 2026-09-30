const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const orderSchema = Joi.object({
  orderItems: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      quantity: Joi.number().integer().min(1).required(),
      name: Joi.string() // name is not required for backend, but might be sent
    }).unknown(true)
  ).min(1).required(),
  shippingAddress: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required()
  }).required(),
  paymentMethod: Joi.string().required()
}).unknown(true); // ignore frontend totals

router.post('/', protect, validate(orderSchema), addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
