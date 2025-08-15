const express = require('express');
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

function sanitize(user) {
  const data = user.toJSON();
  delete data.password;
  delete data.resetToken;
  delete data.resetTokenExpires;
  delete data.verificationToken;
  return data;
}

router.get('/me', auth, async (req, res) => {
  res.json(sanitize(req.user));
});

router.put('/me', auth, upload.single('logo'), async (req, res) => {
  try {
    const { companyName, companyWebsite } = req.body;
    if (companyName !== undefined) {
      req.user.companyName = companyName;
    }
    if (companyWebsite !== undefined) {
      req.user.companyWebsite = companyWebsite;
    }
    if (req.file) {
      req.user.logoUrl = `/uploads/${req.file.filename}`;
    }
    await req.user.save();
    res.json(sanitize(req.user));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
