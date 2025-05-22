const Hashids = require('hashids/cjs');
const hashids = new Hashids('url-shortener', 6);

function generateShortCode(uid) {
  return hashids.encode(uid, Date.now());
}

module.exports = { generateShortCode }; 