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

async function getYelpData(businessId) {
  const response = await fetch(`https://api.yelp.com/v3/businesses/${businessId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.YELP_API_KEY}`, // Use the environment variable for the API key
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from Yelp API');
  }

  return response.json();
}

// Endpoint to fetch data from Yelp API
app.get('/yelp-data/:businessId', async (req, res) => {
  const { businessId } = req.params; // Get the business ID from the request parameters

  try {
    const data = await getYelpData(businessId); // Pass the business ID to the function
    res.json(data); // Send Yelp API response back to client
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from Yelp API' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});