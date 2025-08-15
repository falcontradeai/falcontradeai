const express = require('express');
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { Offer } = require('../models');
const { Op } = require('sequelize');

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
  auth.requireActiveSubscription,
  upload.array('attachments'),
  async (req, res) => {
    try {
      const { symbol, price, quantity } = req.body;
      const attachments = (req.files || []).map((file) => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      }));
      const offer = await Offer.create({
        userId: req.user.id,
        symbol,
        price,
        quantity,
        attachments,
      });
      res.json(offer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get all offers
router.get('/', auth, auth.requireActiveSubscription, async (req, res, next) => {
  try {
    const {
      commodity,
      status,
      sortBy,
      order,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      location,
    } = req.query;

    const where = {};

    if (commodity) {
      where.symbol = { [Op.iLike]: `%${commodity}%` };
    }

    if (status) where.status = status;

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (minQuantity || maxQuantity) {
      where.quantity = {};
      if (minQuantity) where.quantity[Op.gte] = parseInt(minQuantity, 10);
      if (maxQuantity) where.quantity[Op.lte] = parseInt(maxQuantity, 10);
    }

    const options = { where };
    if (sortBy) {
      options.order = [
        [sortBy, order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'],
      ];
    }
    const offers = await Offer.findAll(options);
    res.json(offers);
  } catch (err) {
    next(err);
  }
});

// Get a single offer
router.get('/:id', auth, auth.requireActiveSubscription, async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (err) {
    next(err);
  }
});

// Update an offer (admin only)
router.put('/:id', auth, isAdmin, async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    await offer.update(req.body);
    res.json(offer);
  } catch (err) {
    next(err);
  }
});

// Delete an offer (admin only)
router.delete('/:id', auth, isAdmin, async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    await offer.destroy();
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    next(err);
  }
});

// Approve an offer (admin only)
router.post('/:id/approve', auth, isAdmin, async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    offer.status = 'approved';
    await offer.save();
    res.json(offer);
  } catch (err) {
    next(err);
  }
});

// Feature an offer (admin only)
router.post('/:id/feature', auth, isAdmin, async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    offer.status = 'featured';
    await offer.save();
    res.json(offer);
  } catch (err) {
    next(err);
  }
});

// Update order status (owner only)
router.post('/:id/status', auth, async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    if (!['pending', 'shipped', 'completed'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    offer.orderStatus = orderStatus;
    await offer.save();
    res.json(offer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

