const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { Content } = require('../models');

const router = express.Router();

// Get content by slug
router.get('/:slug', async (req, res) => {
  const item = await Content.findOne({ where: { slug: req.params.slug } });
  if (!item) {
    return res.status(404).json({ message: 'Content not found' });
  }
  return res.json(item);
});

// Upsert content by slug (admin only)
router.put('/:slug', auth, isAdmin, async (req, res) => {
  const { body } = req.body;
  let item = await Content.findOne({ where: { slug: req.params.slug } });
  if (item) {
    await item.update({ body });
  } else {
    item = await Content.create({ slug: req.params.slug, body });
  }
  return res.json(item);
});

module.exports = router;
