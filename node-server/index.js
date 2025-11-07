// index.js

require('dotenv').config(); // Load environment variables from a .env file
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // Choose a port for your backend server

// Middleware to handle JSON responses
app.use(express.json());

// Simple route to verify if the server is working
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Example API route to fetch data from an external API
app.get('/api/data', async (req, res) => {
  try {
    // Example of making an external API request using axios
    const response = await axios.get('https://api.example.com/data');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// Start the server
app.listen(port, () => {
  ////console.log(`Server running on http://localhost:${port}`);
});
