
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');
const matchRoute = require('./routes/match');
const candidateRoute = require('./routes/candidates');
const interviewRoute = require('./routes/interviews');
const resumeRoute = require('./routes/resumeRoutes');
const path = require('path');

const app = express();
const port = 5000;

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (MONGODB_URI) {
    const opts = {
        connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
        serverSelectionTimeoutMS: 5000, // 5 seconds to find a server
    };
    
    console.log('Attempting MongoDB connection on server.js...');
    mongoose.connect(MONGODB_URI, opts)
        .then(() => console.log('Connected to MongoDB (server.js) ✅'))
        .catch(err => {
            console.error('CRITICAL: MongoDB connection error ❌:', err.message);
        });
} else {
    console.warn('MONGODB_URI not found in .env. Skipping DB connection.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/analyze', analyzeRoute);
app.use('/api/match', matchRoute);
app.use('/api/candidates', candidateRoute);
app.use('/api/interviews', interviewRoute);
app.use('/api', resumeRoute);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
