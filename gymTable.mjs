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

async function getGymsData() {
  const url = `https://api.yelp.com/v3/businesses/search?location=California&categories=boxing&limit=10&sort_by=rating`;
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
app.get('/gymTable', async (req, res) => {
  try {
    const gymData = await getGymsData();
    res.json(gymData.businesses); // Send the businesses info
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Yelp API' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});