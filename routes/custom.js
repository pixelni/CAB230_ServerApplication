const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const auth = require('../middleware/auth');

// Custom GET endpoint:get volcanoes within a certain range)
router.get('/volcanoes/within', async (req, res) => {
  const { lat, long, range } = req.query;

  const query = `
    SELECT *, (
      6371 * acos (
      cos ( radians(?) )
      * cos( radians( latitude ) )
      * cos( radians( longitude ) - radians(?) )
      + sin ( radians(?) )
      * sin( radians( latitude ) )
    )) AS distance
    FROM volcanoes
    HAVING distance < ?
    ORDER BY distance`;

  try {
    const volcanoes = await knex.raw(query, [lat, long, lat, range]);
    res.json(volcanoes[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Custom POST endpoint:add a comment to a volcano)
router.post('/volcanoes/:id/comment', auth, async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userEmail = req.user.email;

  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }

  try {
    await knex('comments').insert({ volcano_id: id, user_email: userEmail, comment });
    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
