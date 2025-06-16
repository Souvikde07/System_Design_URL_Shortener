const mongoose = require('mongoose');
const Redis = require('redis');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const redisClient = Redis.createClient({
  url: process.env.REDIS_URI,
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect().then(() => console.log('Redis connected'));

module.exports = { connectDB, redisClient };