const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Lista de emails que podem ver registros (em minúsculas para comparação)
const ADMIN_EMAILS = [
  'livia.quinquiolo@docusign.com',
  'nicole.lima@docusign.com',
  'joe.desmarais@docusign.com',
  'regina.murphy@docusign.com',
  'ali.talabe@docusign.com',
  'v.avasiloaei@docusign.com',
  'jose.hernandez@docusign.com',
  'mohammed.khan@docusign.com',
  'steven.williams@docusign.com'
];

// REGISTER - ONLY @docusign.com
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailLower = email.toLowerCase();

    if (!emailLower.endsWith('@docusign.com')) {
      return res.status(400).json({ error: 'Only @docusign.com emails are allowed' });
    }

    let user = await User.findOne({ email: emailLower });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = new User({
      name,
      email: emailLower,
      password: hashedPassword,
      canViewRecords: ADMIN_EMAILS.includes(emailLower)
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        canViewRecords: user.canViewRecords
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    if (!emailLower.endsWith('@docusign.com')) {
      return res.status(400).json({ error: 'Only @docusign.com emails are allowed' });
    }

    let user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        canViewRecords: user.canViewRecords
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ME
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
