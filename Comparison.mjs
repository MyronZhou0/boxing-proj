import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import { exec } from 'child_process'; // Import exec from child_process


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // To parse JSON bodies

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
app.get('/comparer', async (req, res) => {
  const { businessId1, businessId2} = req.params;

  try {
    const gymData1 = await getGymData(businessId1);
    const gymData2 = await getGymData(businessId2);
    console.log(gymData);
    const yelpUrl = gymData.url;
    console.log(yelpUrl);
    res.status(200).json(
        gymData
    );
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Yelp API' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
