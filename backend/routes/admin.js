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
const { Notification, User } = require('../models');
const notificationService = require('../services/notificationService');

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

// Notifications
router.post('/notifications', auth, isAdmin, async (req, res) => {
  try {
    const { message, targetRoles } = req.body;
    if (!message || !Array.isArray(targetRoles)) {
      return res.status(400).json({ message: 'message and targetRoles are required' });
    }
    const notification = await Notification.create({ message, targetRoles });
    const users = await User.findAll({ where: { role: targetRoles } });
    await notificationService.broadcast(notification, users);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/notifications', auth, isAdmin, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

