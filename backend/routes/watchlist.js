const express = require('express');
const auth = require('../middleware/auth');
const { WatchlistItem } = require('../models');

const router = express.Router();

// Get watchlist items for the authenticated user
router.get('/', auth, async (req, res) => {
  const items = await WatchlistItem.findAll({ where: { userId: req.user.id } });
  res.json(items);
});

// Add a new watchlist item
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, price } = req.body;
    const item = await WatchlistItem.create({ userId: req.user.id, symbol, price });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a watchlist item
router.put('/:id', auth, async (req, res) => {
  const item = await WatchlistItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  await item.update(req.body);
  return res.json(item);
});

// Delete a watchlist item
router.delete('/:id', auth, async (req, res) => {
  const item = await WatchlistItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  await item.destroy();
  return res.json({ message: 'Item deleted' });
});

module.exports = router;
