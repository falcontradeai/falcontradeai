const { User, Offer, RFQ, sequelize } = require('../models');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function getMetrics(req, res) {
  try {
    const userCount = await User.count();

    const approvedOffers = await Offer.findAll({ where: { status: 'approved' } });
    const totalRevenue = approvedOffers.reduce(
      (sum, offer) => sum + offer.price * offer.quantity,
      0,
    );

    const pendingListings = await Offer.count({ where: { status: 'pending' } });

    const subscriptions = await stripe.subscriptions.list({
      status: 'all',
      limit: 100,
    });
    const subscriptionRevenue =
      subscriptions.data
        .filter((s) => s.status === 'active')
        .reduce((sum, s) => {
          const item = s.items.data[0];
          const amount = item?.price?.unit_amount ?? 0;
          const quantity = item?.quantity ?? 1;
          return sum + amount * quantity;
        }, 0) / 100;

    const activeRFQs = await RFQ.count({ where: { status: 'approved' } });
    const activeDeals = approvedOffers.length + activeRFQs;

    const offerAgg = await Offer.findAll({
      where: { status: 'approved' },
      attributes: [
        'symbol',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'listingCount'],
      ],
      group: ['symbol'],
      raw: true,
    });
    const rfqAgg = await RFQ.findAll({
      where: { status: 'approved' },
      attributes: [
        'symbol',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'listingCount'],
      ],
      group: ['symbol'],
      raw: true,
    });

    const commodityMap = {};
    [...offerAgg, ...rfqAgg].forEach((row) => {
      const symbol = row.symbol;
      if (!commodityMap[symbol]) {
        commodityMap[symbol] = { totalQuantity: 0, listingCount: 0 };
      }
      commodityMap[symbol].totalQuantity += Number(row.totalQuantity);
      commodityMap[symbol].listingCount += Number(row.listingCount);
    });

    const topCommodities = Object.entries(commodityMap)
      .map(([symbol, data]) => ({ symbol, ...data }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    res.json({
      userCount,
      totalRevenue,
      pendingListings,
      subscriptionRevenue,
      activeDeals,
      topCommodities,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { role, subscriptionStatus, status } = req.body;
    if (role) user.role = role;
    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus;
    if (status) user.status = status;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function blockUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = 'blocked';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function approveUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getListings(req, res) {
  try {
    const offers = await Offer.findAll();
    const rfqs = await RFQ.findAll();
    res.json({ offers, rfqs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function approveListing(req, res) {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    offer.status = 'approved';
    await offer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function rejectListing(req, res) {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    offer.status = 'rejected';
    await offer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteListing(req, res) {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    await offer.destroy();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRFQs(req, res) {
  try {
    const rfqs = await RFQ.findAll();
    res.json(rfqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function approveRFQ(req, res) {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    rfq.status = 'approved';
    await rfq.save();
    res.json(rfq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function rejectRFQ(req, res) {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    rfq.status = 'rejected';
    await rfq.save();
    res.json(rfq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getStripeRevenue(req, res) {
  try {
    const charges = await stripe.charges.list({ limit: 100 });
    const revenue = charges.data
      .filter((c) => c.status === 'succeeded')
      .reduce((sum, c) => sum + c.amount, 0);
    res.json({ revenue: revenue / 100 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMetrics,
  getUsers,
  updateUser,
  blockUser,
  approveUser,
  deleteUser,
  getListings,
  approveListing,
  rejectListing,
  deleteListing,
  getRFQs,
  approveRFQ,
  rejectRFQ,
  getStripeRevenue,
};

