// backend/routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order.js");
const auth = require("../middleware/authMiddleware.js");

// Initialize Stripe with the secret key from environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice, paymentMethodId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Cannot create order." });
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe requires amount in the smallest currency unit (cents)
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' }, // Prevents redirects for this flow
    });

    // Create a new order instance
    const order = new Order({
      user: req.user.id,
      orderItems: orderItems.map(item => ({
        ...item,
        product: item.productId, // Ensure the 'product' field is linked to the Product model
      })),
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: true, // Mark as paid since the payment succeeded
      paidAt: Date.now(),
      paymentResult: { // Store the result from Stripe
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    // Handle errors from Stripe or MongoDB
    console.error("Stripe/Order Creation Error:", error.message);
    res.status(400).json({ message: `Payment failed: ${error.message}` });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
router.get("/my", auth, async (req, res) => {
  try {
    // Find orders for the current user and sort by the newest first
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch User Orders Error:", error.message);
    res.status(500).json({ message: "Could not fetch your orders. Please try again later." });
  }
});

module.exports = router;