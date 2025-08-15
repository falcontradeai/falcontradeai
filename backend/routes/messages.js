const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const { Message } = require('../models');
const multer = require('multer');
const path = require('path');

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/gif',
];

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const router = express.Router();

// Get count of unread messages
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.count({
      where: { toUserId: req.user.id, read: false },
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message referencing a listing or RFQ
router.post('/', auth, upload.array('attachments'), async (req, res) => {
  try {
    const { toUserId, content, listingId, rfqId } = req.body;
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
      listingId,
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
  const { listingId, rfqId } = req.query;
  const where = {
    [Op.or]: [
      { fromUserId: req.user.id },
      { toUserId: req.user.id },
    ],
  };
  if (listingId) where.listingId = listingId;
  if (rfqId) where.rfqId = rfqId;

  const messages = await Message.findAll({
    where,
    order: [['createdAt', 'ASC']],
  });
  if (listingId || rfqId) {
    const unreadIds = messages
      .filter((m) => m.toUserId === req.user.id && !m.read)
      .map((m) => m.id);
    if (unreadIds.length) {
      await Message.update({ read: true }, { where: { id: unreadIds } });
    }
    return res.json(messages);
  }

  const grouped = messages.reduce((acc, msg) => {
    const key = msg.listingId
      ? `listing-${msg.listingId}`
      : msg.rfqId
      ? `rfq-${msg.rfqId}`
      : `direct-${[msg.fromUserId, msg.toUserId].sort().join('-')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});
  res.json(grouped);
});

module.exports = router;

