const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { RFQ } = require('../models');

const router = express.Router();

// Create a new RFQ
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const rfq = await RFQ.create({
      userId: req.user.id,
      symbol,
      quantity,
    });
    res.json(rfq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all RFQs
router.get('/', auth, async (req, res) => {
  const rfqs = await RFQ.findAll();
  res.json(rfqs);
});

// Get a single RFQ
router.get('/:id', auth, async (req, res) => {
  const rfq = await RFQ.findByPk(req.params.id);
  if (!rfq) {
    return res.status(404).json({ message: 'RFQ not found' });
  }
  res.json(rfq);
});

// Update an RFQ (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const rfq = await RFQ.findByPk(req.params.id);
  if (!rfq) {
    return res.status(404).json({ message: 'RFQ not found' });
  }
  await rfq.update(req.body);
  res.json(rfq);
});

// Delete an RFQ (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  const rfq = await RFQ.findByPk(req.params.id);
  if (!rfq) {
    return res.status(404).json({ message: 'RFQ not found' });
  }
  await rfq.destroy();
  res.json({ message: 'RFQ deleted' });
});

// Approve an RFQ (admin only)
router.post('/:id/approve', auth, isAdmin, async (req, res) => {
  const rfq = await RFQ.findByPk(req.params.id);
  if (!rfq) {
    return res.status(404).json({ message: 'RFQ not found' });
  }
  rfq.status = 'approved';
  await rfq.save();
  res.json(rfq);
});

// Feature an RFQ (admin only)
router.post('/:id/feature', auth, isAdmin, async (req, res) => {
  const rfq = await RFQ.findByPk(req.params.id);
  if (!rfq) {
    return res.status(404).json({ message: 'RFQ not found' });
  }
  rfq.status = 'featured';
  await rfq.save();
  res.json(rfq);
});

module.exports = router;

