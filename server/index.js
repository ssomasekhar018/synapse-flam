// server/index.js
// Express runner for local development

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config(); // Fallback to current working directory .env

const generateHandler = require('./api/generate');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API route endpoint matching Vercel Serverless directory structure /api/generate
app.post('/api/generate', (req, res) => generateHandler(req, res));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Synapse Express Proxy server listening on port ${PORT}`);
});
