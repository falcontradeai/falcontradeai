const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { Offer } = require('../models');

const router = express.Router();

// Create a new offer
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, price, quantity } = req.body;
    const offer = await Offer.create({
      userId: req.user.id,
      symbol,
      price,
      quantity,
    });
    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all offers
router.get('/', auth, async (req, res) => {
  const offers = await Offer.findAll();
  res.json(offers);
});

// Get a single offer
router.get('/:id', auth, async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) {
    return res.status(404).json({ message: 'Offer not found' });
  }
  res.json(offer);
});

// Update an offer (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) {
    return res.status(404).json({ message: 'Offer not found' });
  }
  await offer.update(req.body);
  res.json(offer);
});

// Delete an offer (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) {
    return res.status(404).json({ message: 'Offer not found' });
  }
  await offer.destroy();
  res.json({ message: 'Offer deleted' });
});

// Approve an offer (admin only)
router.post('/:id/approve', auth, isAdmin, async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) {
    return res.status(404).json({ message: 'Offer not found' });
  }
  offer.status = 'approved';
  await offer.save();
  res.json(offer);
});

// Feature an offer (admin only)
router.post('/:id/feature', auth, isAdmin, async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) {
    return res.status(404).json({ message: 'Offer not found' });
  }
  offer.status = 'featured';
  await offer.save();
  res.json(offer);
});

module.exports = router;

