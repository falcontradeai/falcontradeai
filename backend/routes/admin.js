const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const {
  getMetrics,
  getUsers,
  updateUser,
  blockUser,
  approveUser,
  deleteUser,
  getListings,
  approveListing,
  rejectListing,
  deleteListing,
  getRFQs,
  approveRFQ,
  rejectRFQ,
  getStripeRevenue,
} = require('../controllers/admin');

const router = express.Router();

router.get('/metrics', auth, isAdmin, getMetrics);
router.get('/users', auth, isAdmin, getUsers);
router.put('/users/:id', auth, isAdmin, updateUser);
router.post('/users/:id/block', auth, isAdmin, blockUser);
router.post('/users/:id/approve', auth, isAdmin, approveUser);
router.delete('/users/:id', auth, isAdmin, deleteUser);
router.get('/listings', auth, isAdmin, getListings);
router.post('/listings/:id/approve', auth, isAdmin, approveListing);
router.post('/listings/:id/reject', auth, isAdmin, rejectListing);
router.delete('/listings/:id', auth, isAdmin, deleteListing);
router.get('/rfqs', auth, isAdmin, getRFQs);
router.post('/rfqs/:id/approve', auth, isAdmin, approveRFQ);
router.post('/rfqs/:id/reject', auth, isAdmin, rejectRFQ);
router.get('/revenue', auth, isAdmin, getStripeRevenue);

module.exports = router;

