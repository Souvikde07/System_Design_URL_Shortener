const ShortUrl = require('../models/shortUrl');
const redisClient = require('../db/cache');
const { generateShortCode } = require('../utils/hash');
const { v4: uuidv4 } = require('uuid');

async function shortenUrl(longUrl) {
  const uid = uuidv4();
  const shortCode = generateShortCode(uid);
  const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`;

  // Save to DB
  const urlDoc = new ShortUrl({
    short_url: shortUrl,
    long_url: longUrl,
    uid,
  });
  await urlDoc.save();

  // Save to Redis
  await redisClient.set(shortCode, longUrl);

  return shortUrl;
}

module.exports = { shortenUrl }; 