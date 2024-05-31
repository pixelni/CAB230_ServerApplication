const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

// Get all volcanoes
router.get('/', async (req, res) => {
  try {
    const volcanoes = await knex.select('*').from('volcanoes');
    res.json(volcanoes);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get a volcano by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const volcano = await knex('volcanoes').where({ id }).first();
    if (volcano) {
      res.json(volcano);
    } else {
      res.status(404).json({ error: 'Volcano not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
