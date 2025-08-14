const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate(['trader', 'admin']), (req, res) => {
  res.json({ message: 'Messages endpoint' });
});

module.exports = router;
