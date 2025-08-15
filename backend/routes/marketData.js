const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const marketDataController = require('../controllers/marketData');

const router = express.Router();

router.get(
  '/:commodity',
  auth,
  auth.requireActiveSubscription,
  marketDataController.getMarketData
);
router.post('/:commodity', auth, isAdmin, marketDataController.addMarketData);
router.put('/:commodity', auth, isAdmin, marketDataController.updateMarketData);

module.exports = router;
