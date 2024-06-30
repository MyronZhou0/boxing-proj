import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

const yelpApiKey = process.env.YELP_API_KEY; // Secure API key

async function getGymData(businessId) {
  const url = `https://api.yelp.com/v3/businesses/${businessId}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${yelpApiKey}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    const errorMessage = `Failed to fetch data from Yelp API. Status: ${response.status}, Response: ${errorText}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

// Endpoint to fetch data from Yelp API
app.get('/gymPage/:businessId', async (req, res) => {
  const { businessId } = req.params;

  try {
    const gymData = await getGymData(businessId);
    res.json(gymData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Yelp API' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});