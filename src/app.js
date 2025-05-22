const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Import routes
const routes = require('./api/routes');
app.use('/', routes);

const connectToMongo = require('./db/nosql');//connectToMongo just stores the imported function
require('./db/cache'); //directly connect to redis no assign to any variable required

connectToMongo();//calls the function previously imported

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 