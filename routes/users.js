const express = require('express');
const router = express.Router();
const knex = require('../db/knex'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await knex('users').insert({ email, name, password: hashedPassword });
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await knex('users').where({ email }).first();
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get user profile
router.get('/:email/profile', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await knex('users').where({ email }).first();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user profile
router.put('/:email/profile', async (req, res) => {
  const { email } = req.params;
  const { name } = req.body;

  try {
    await knex('users').where({ email }).update({ name });
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// /me endpoint
router.get('/me', (req, res) => {
  res.json({
    name: 'Mike Wazowski',
    student_number: 'n1234567'
  });
});

module.exports = router;
