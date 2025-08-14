const express = require('express');
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const { isAdmin, isSubscriber } = require('../middleware/roles');
const { Offer } = require('../models');

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

// Create a new offer
router.post(
  '/',
  auth,
  isSubscriber,
  auth.requireActiveSubscription,
  upload.array('attachments'),
  async (req, res) => {
    try {
      const { symbol, price, quantity } = req.body;
      const offer = await Offer.create({
        userId: req.user.id,
        symbol,
        price,
        quantity,
      });
      const attachments = (req.files || []).map((file) => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      }));
      const result = offer.toJSON();
      result.attachments = attachments;
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get all offers
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
  const offers = await Offer.findAll(options);
  res.json(offers);
});

// Get a single offer
router.get('/:id', auth, isSubscriber, auth.requireActiveSubscription, async (req, res) => {
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

