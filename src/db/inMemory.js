const store = {};

function increment(shortUrl) {
  if (!store[shortUrl]) store[shortUrl] = 0;
  store[shortUrl]++;
}

function getCount(shortUrl) {
  return store[shortUrl] || 0;
}

function flushToDb() {
  // TODO: Implement flush to persistent DB
  // Reset store after flush
  for (const key in store) {
    store[key] = 0;
  }
}

module.exports = { increment, getCount, flushToDb }; 