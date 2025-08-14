const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
  res.json({ message: 'Offers endpoint' });
});

module.exports = router;
