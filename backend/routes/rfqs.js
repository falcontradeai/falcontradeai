const express = require('express');
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const { isAdmin, isSubscriber } = require('../middleware/roles');
const { RFQ } = require('../models');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

// Create a new RFQ
router.post(
  '/',
  auth,
  isSubscriber,
  auth.requireActiveSubscription,
  upload.array('attachments'),
  async (req, res) => {
    try {
      const { symbol, quantity } = req.body;
      const rfq = await RFQ.create({
        userId: req.user.id,
        symbol,
        quantity,
      });
      const attachments = (req.files || []).map((file) => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      }));
      const result = rfq.toJSON();
      result.attachments = attachments;
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get all RFQs
router.get('/', auth, isSubscriber, auth.requireActiveSubscription, async (req, res) => {
  const { commodity, status, sortBy, order } = req.query;
  const where = {};
  if (commodity) where.symbol = commodity;
  if (status) where.status = status;
  const options = { where };
  if (sortBy) {
    options.order = [
      [sortBy, order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'],
    ];
  }
  const rfqs = await RFQ.findAll(options);
  res.json(rfqs);
});

// Get a single RFQ
router.get('/:id', auth, isSubscriber, auth.requireActiveSubscription, async (req, res) => {
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

