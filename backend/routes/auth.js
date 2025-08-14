const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User } = require('../models');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/signup', async (req, res) => {
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
        from: process.env.SMTP_FROM || 'no-reply@falcontrade.com',
        subject: 'Verify your email',
        text: `Click to verify your email: http://localhost:3000/verify-email?token=${verificationToken}`,
      });
    } catch (mailErr) {
      console.error('Error sending verification email', mailErr);
    }

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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { username: email } });
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    await user.save();
    try {
      await transporter.sendMail({
        to: email,
        from: process.env.SMTP_FROM || 'no-reply@falcontrade.com',
        subject: 'Password Reset',
        text: `Reset your password: http://localhost:3000/reset-password?token=${resetToken}`,
      });
    } catch (mailErr) {
      console.error('Error sending reset email', mailErr);
    }
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({ where: { resetToken: token } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    user.password = password;
    user.resetToken = null;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
