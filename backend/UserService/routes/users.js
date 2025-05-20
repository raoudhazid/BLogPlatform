const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../../api-gateway/middleware/auth');
const router = express.Router();

// Get all users (Admin only), with optional role filter
router.get('/', authMiddleware('Admin'), async (req, res) => {
  try {
    const { role } = req.query;
    const validRoles = ['Admin', 'Editor', 'Writer', 'Reader'];

    // Build query object
    const query = {};
    if (role) {
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      query.role = role;
    }

    const users = await User.find(query).select('-password -refreshToken');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (Admin only)
router.patch('/:id/role', authMiddleware('Admin'), async (req, res) => {
  const { role } = req.body;
  if (!['Admin', 'Editor', 'Writer', 'Reader'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;