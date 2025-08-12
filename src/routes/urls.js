const express = require('express');
const crypto = require('crypto');
const database = require('../db');
const { isValidUrl } = require('../utils/validation');

const router = express.Router();

function generateId(idLength = 7) {
  const bytesNeeded = Math.ceil((idLength * 3) / 4);
  return crypto.randomBytes(bytesNeeded).toString('base64url').slice(0, idLength);
}

router.post('/api/shorten', (req, res) => {
  const { url } = req.body || {};
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL. Include http(s):// protocol.' });
  }

  const id = generateId(7);
  database.run(
    'INSERT INTO urls (id, original_url) VALUES (?, ?)',
    [id, url],
    function onInsert(error) {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      return res.status(201).json({ id, shortUrl: `${baseUrl}/${id}` });
    },
  );
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  database.get('SELECT original_url FROM urls WHERE id = ?', [id], (error, row) => {
    if (error) {
      return res.status(500).send('Database error');
    }
    if (!row) {
      return res.status(404).send('Not found');
    }
    database.run('UPDATE urls SET hits = hits + 1 WHERE id = ?', [id], () => {
      return res.redirect(row.original_url);
    });
  });
});

module.exports = router;

