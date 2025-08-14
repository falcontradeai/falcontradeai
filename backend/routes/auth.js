const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.create({ username, password, role });
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000,
    });
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', async (req, res) => {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
