const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { Op } = require('sequelize');
const { User } = require('../models');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

router.post('/signup', authLimiter, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      username,
      password,
      role,
      verificationToken,
    });

    try {
      await transporter.sendMail({
        to: username,
        from: process.env.EMAIL_FROM || 'no-reply@falcontrade.com',
        subject: 'Verify your email',
        text: `Click to verify your email: ${FRONTEND_URL}/verify-email?token=${verificationToken}`,
      });
    } catch (mailErr) {
      console.error('Error sending verification email', mailErr);
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.verificationToken) {
      return res.status(403).json({ message: 'Please verify your email' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600000,
    });
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
    });
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
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    user.verificationToken = null;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { username: email } });
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetToken = hashedToken;
    user.resetTokenExpires = new Date(Date.now() + 3600000);
    await user.save();
    try {
      await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_FROM || 'no-reply@falcontrade.com',
        subject: 'Password Reset',
        text: `Reset your password: ${FRONTEND_URL}/reset-password?token=${resetToken}`,
      });
    } catch (mailErr) {
      console.error('Error sending reset email', mailErr);
    }
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset-password', authLimiter, async (req, res) => {
  const { token, password } = req.body;
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await User.findOne({
      where: {
        resetToken: hashedToken,
        resetTokenExpires: { [Op.gt]: new Date() },
      },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.password = password;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
