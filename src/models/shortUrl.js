const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  short_url: { type: String, required: true, unique: true },
  long_url: { type: String, required: true },
  uid: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  used_count: { type: Number, default: 0 }
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema); 