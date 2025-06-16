const express = require('express');
const { generateHash } = require('../utils/hash');
const { encodeBase62 } = require('../utils/base62');
const Url = require('../models/modelUrl');
const { redisClient } = require('../config/db');

const router = express.Router();

// Shorten URL
router.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const hash = generateHash(url);
    const shortId = encodeBase62(hash);

    let urlDoc = await Url.findOne({ shortId });
    if (urlDoc) {
      if (urlDoc.originalUrl !== url) {
        return res.status(409).json({ error: 'Short ID collision' });
      }
      return res.json({ shortUrl: `${req.get('host')}/${shortId}` });
    }

    urlDoc = new Url({ shortId, originalUrl: url });
    await urlDoc.save();

    await redisClient.setEx(shortId, 7 * 24 * 60 * 60, url); // Cache for 7 days

    res.json({ shortUrl: `${req.get('host')}/${shortId}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect
router.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    // Check cache
    const cachedUrl = await redisClient.get(shortId);
    if (cachedUrl) {
      await Url.findOneAndUpdate({ shortId }, { $inc: { clickCount: 1 } });
      return res.redirect(302, cachedUrl);
    }

    // Check database
    const urlDoc = await Url.findOne({ shortId });
    if (!urlDoc) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Update cache and click count
    await redisClient.setEx(shortId, 7 * 24 * 60 * 60, urlDoc.originalUrl);
    await urlDoc.updateOne({ $inc: { clickCount: 1 } });

    res.redirect(302, urlDoc.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Analytics
router.get('/analytics/:shortId', async (req, res) => {
  const { shortId } = req.params;
  try {
    const urlDoc = await Url.findOne({ shortId }, 'clickCount');
    if (!urlDoc) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    res.json({ shortId, clickCount: urlDoc.clickCount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;