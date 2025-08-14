const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { NewsItem } = require('../models');

const router = express.Router();

// Get all news items
router.get('/', auth, async (req, res) => {
  const items = await NewsItem.findAll();
  res.json(items);
});

// Create a news item (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, content, publishedAt } = req.body;
    const item = await NewsItem.create({ title, content, publishedAt });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a news item (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const item = await NewsItem.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'News not found' });
  }
  await item.update(req.body);
  return res.json(item);
});

// Delete a news item (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  const item = await NewsItem.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'News not found' });
  }
  await item.destroy();
  return res.json({ message: 'News deleted' });
});

module.exports = router;
