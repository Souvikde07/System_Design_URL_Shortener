const crypto = require('crypto');

const generateHash = (url) => {
  return crypto.createHash('sha256').update(url).digest('hex');
};

module.exports = { generateHash };