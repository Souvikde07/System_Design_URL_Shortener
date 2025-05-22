const express = require('express');
const router = express.Router();
const { shortenUrl } = require('../services/urlShorteningService');
const { getLongUrl } = require('../services/urlRedirectionService');
const { getAnalytics } = require('../services/analyticsService');

// POST /shorten - Shorten a URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: 'longUrl is required' });
  try {
    const shortUrl = await shortenUrl(longUrl);
    res.json({ shortUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// GET /:shortUrl - Redirect to long URL
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const longUrl = await getLongUrl(shortUrl);
    if (longUrl) {
      return res.redirect(302, longUrl);
    }
    res.status(404).send('URL not found');
  } catch (err) {
    res.status(500).send('Error during redirection');
  }
});

// GET /analytics/:shortUrl - Get analytics for a short URL
router.get('/analytics/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const analytics = getAnalytics(shortUrl);
  res.json(analytics);
});

module.exports = router; 