const { getCount } = require('../db/inMemory');

function getAnalytics(shortCode) {
  return {
    shortCode,
    used_count: getCount(shortCode),
  };
}

module.exports = { getAnalytics }; 