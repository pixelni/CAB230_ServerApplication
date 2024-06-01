const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

// Get all countries
router.get('/countries', async (req, res) => {
    try {
      const countries = await knex('data').distinct('country').orderBy('country');
      res.json(countries.flatMap((c) => c.country));
    } catch (error) {
      console.error(error.stack);
      res.status(500).json({ error: 'Database error' });
    }
});

// Get all volcanoes
router.get('/volcanoes', async (req, res) => {
  try {
    const country = req.query['country'];
    const populatedWithin = req.query['populatedWithin'];
    const query = knex('data').where('country', country);
    if (populatedWithin)
        query.where('population_' + populatedWithin, '>', 0);
    res.send(await query.select('id', 'name', 'country', 'region', 'subregion'));
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get a volcano by ID
router.get('/volcano/:id', async (req, res) => {
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
