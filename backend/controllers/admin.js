const { User, Offer } = require('../models');

async function getMetrics(req, res) {
  try {
    const userCount = await User.count();
    const approvedOffers = await Offer.findAll({ where: { status: 'approved' } });
    const totalRevenue = approvedOffers.reduce(
      (sum, offer) => sum + offer.price * offer.quantity,
      0,
    );
    const pendingListings = await Offer.count({ where: { status: 'pending' } });
    res.json({ userCount, totalRevenue, pendingListings });
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
    res.json(offers);
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

module.exports = {
  getMetrics,
  getUsers,
  deleteUser,
  getListings,
  approveListing,
  deleteListing,
};

