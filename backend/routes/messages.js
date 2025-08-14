const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const { Message } = require('../models');

const router = express.Router();

// Send a message referencing an offer or RFQ
router.post('/', auth, async (req, res) => {
  try {
    const { toUserId, content, offerId, rfqId } = req.body;
    const message = await Message.create({
      fromUserId: req.user.id,
      toUserId,
      content,
      offerId,
      rfqId,
    });
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all messages for the authenticated user
router.get('/', auth, async (req, res) => {
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { fromUserId: req.user.id },
        { toUserId: req.user.id },
      ],
    },
  });
  res.json(messages);
});

module.exports = router;

