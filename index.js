const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// SABOTAGE 1: Expects a very specific environment variable name!
const dbUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/phoenix';

mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Failed to connect:', err));

// FIX: Vite builds the frontend into the 'dist' folder by default, not 'public'
const uiPath = path.join(__dirname, 'dist');
app.use(express.static(uiPath));

app.get('/api/health', (req, res) => res.json({ status: 'API is alive' }));

// Serve index.html for any non-API route so the SPA works on direct loads/refreshes
app.get('*', (req, res) => {
  res.sendFile(path.join(uiPath, 'index.html'));
});

app.listen(5000, () => console.log('Server running on port 5000'));