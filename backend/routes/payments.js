const express = require('express');
const auth = require('../middleware/auth');
const Stripe = require('stripe');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Map subscription plans to Stripe price IDs
const priceMap = {
  basic: process.env.STRIPE_BASIC_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
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

module.exports = router;
