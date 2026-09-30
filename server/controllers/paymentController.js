const { Order } = require('../models');

const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // This is where integration with Stripe, Razorpay, etc. would go
    // For now we mock the intent
    const paymentIntent = {
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random()}`,
      orderId: order.id,
      amount: order.total
    };

    res.json(paymentIntent);
  } catch (error) {
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
