const express = require('express');
const auth = require('../middleware/auth');
const Stripe = require('stripe');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      subscription_data: {
        metadata: { userId: req.user.id },
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
