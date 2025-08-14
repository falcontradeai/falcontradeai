const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const { Message } = require('../models');
const multer = require('multer');
const path = require('path');

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

const router = express.Router();

// Send a message referencing an offer or RFQ
router.post('/', auth, upload.array('attachments'), async (req, res) => {
  try {
    const { toUserId, content, offerId, rfqId } = req.body;
    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));
    const message = await Message.create({
      fromUserId: req.user.id,
      toUserId,
      content,
      offerId,
      rfqId,
      attachments,
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

