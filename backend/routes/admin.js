const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const {
  getMetrics,
  getUsers,
  deleteUser,
  getListings,
  approveListing,
  deleteListing,
} = require('../controllers/admin');

const router = express.Router();

router.get('/metrics', auth, isAdmin, getMetrics);
router.get('/users', auth, isAdmin, getUsers);
router.delete('/users/:id', auth, isAdmin, deleteUser);
router.get('/listings', auth, isAdmin, getListings);
router.post('/listings/:id/approve', auth, isAdmin, approveListing);
router.delete('/listings/:id', auth, isAdmin, deleteListing);

module.exports = router;

