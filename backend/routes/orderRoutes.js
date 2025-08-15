// backend/routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order.js");
const auth = require("../middleware/authMiddleware.js");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ADD THIS LINE FOR DEBUGGING
console.log('Stripe Secret Key being used:', process.env.STRIPE_SECRET_KEY);


router.post("/", auth, async (req, res) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice, paymentMethodId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    });

    const order = new Order({
      user: req.user.id,
      orderItems: orderItems.map(item => ({
        ...item,
        product: item.productId, // Link to product model
      })),
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Stripe/Order Error:", error.message);
    res.status(400).json({ message: `Payment failed: ${error.message}` });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch orders" });
  }
});

module.exports = router;