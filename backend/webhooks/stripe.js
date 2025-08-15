const Stripe = require('stripe');
const { User } = require('../models');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object;
  const userId = subscription?.metadata?.userId;

  if (userId) {
    const user = await User.findByPk(userId);
    if (user) {
      switch (event.type) {
        case 'customer.subscription.deleted':
          user.subscriptionStatus = 'canceled';
          if (user.role === 'subscriber') {
            user.role = 'buyer';
          }
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          user.subscriptionStatus = subscription.status;
          if (subscription.status === 'active') {
            user.role = 'subscriber';
          }
          break;
        default:
          break;
      }
      await user.save();
    }
  }

  res.json({ received: true });
};
