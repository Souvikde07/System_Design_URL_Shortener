const ShortUrl = require('../models/shortUrl');
const redisClient = require('../db/cache');
const { increment } = require('../db/inMemory');

async function getLongUrl(shortCode) {
  // Try Redis first
  let longUrl = await redisClient.get(shortCode);
  if (longUrl) {
    increment(shortCode);
    return longUrl;
  }
  // Fallback to DB
  const urlDoc = await ShortUrl.findOne({ short_url: { $regex: `${shortCode}$` } });
  if (urlDoc) {
    // Cache in Redis
    await redisClient.set(shortCode, urlDoc.long_url);
    increment(shortCode);
    return urlDoc.long_url;
  }
  return null;
}

module.exports = { getLongUrl }; 