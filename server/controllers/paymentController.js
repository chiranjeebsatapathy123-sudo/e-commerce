const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock'); // fallback if env missing
const { Order } = require('../models');

const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // Mock for dev
      return res.json({
        clientSecret: `pi_mock_${Date.now()}_secret_${Math.random()}`,
        orderId: order.id,
        amount: order.total
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      metadata: { orderId: order.id },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      amount: order.total
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { orderId, paymentId, status } = req.body;
  
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify payment with provider (Stripe/Razorpay)
    // Mocking verification for architecture
    if (status === 'SUCCESS') {
      order.paymentStatus = 'Paid';
      order.paymentId = paymentId;
      await order.save();
      res.json({ message: 'Payment verified successfully', order });
    } else {
      order.paymentStatus = 'Failed';
      await order.save();
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  verifyPayment
};
