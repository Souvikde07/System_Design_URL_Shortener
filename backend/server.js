const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const urlRoutes = require('./routes/url');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to databases
connectDB();

// Routes
app.use('/api', urlRoutes);
app.use('/', urlRoutes); // For redirection

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));