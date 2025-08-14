const express = require('express');
const auth = require('../middleware/auth');
const { isSubscriber } = require('../middleware/roles');
const forecastController = require('../controllers/forecast');

const router = express.Router();

router.get(
  '/:commodity',
  auth,
  isSubscriber,
  auth.requireActiveSubscription,
  forecastController.getForecast
);

module.exports = router;
