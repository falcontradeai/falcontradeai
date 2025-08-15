const express = require('express');
const auth = require('../middleware/auth');
const Stripe = require('stripe');
const { User } = require('../models');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Map subscription plans to Stripe price IDs
const priceMap = {
  premium: process.env.STRIPE_PREMIUM_PRICE_ID,
};

router.get('/create-checkout-session', auth, async (req, res) => {
  try {
    const { plan } = req.query;
    const priceId = priceMap[plan];

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: req.user.username,
      subscription_data: {
        metadata: { userId: req.user.id, plan },
      },
    });

    // Redirect user to Stripe hosted checkout page
    res.redirect(303, session.url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Allow users to cancel their active subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const customerList = await stripe.customers.list({
      email: req.user.username,
      limit: 1,
    });
    const customer = customerList.data[0];
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });
    const subscription = subscriptions.data[0];
    if (!subscription) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    await stripe.subscriptions.del(subscription.id);

    const user = await User.findByPk(req.user.id);
    if (user) {
      user.subscriptionStatus = 'canceled';
      if (user.role === 'subscriber') {
        user.role = 'buyer';
      }
      await user.save();
    }

    res.json({ message: 'Subscription canceled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
