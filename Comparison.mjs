import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

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
// Activates when the link to comparison is clicked and request is sent to the backend
app.get('/comparison/:businessId1/:businessId2', async (req, res) => {
  const { businessId1, businessId2 } = req.params;
  console.log(businessId1, businessId2);
  try {
    const gymData1 = await getGymData(businessId1);
    const gymData2 = await getGymData(businessId2);
    console.log(gymData1);
    console.log(gymData2);
    const gymData = {gymData1: gymData1, gymData2: gymData2}
    console.log("AAAAAAAA");
    console.log(gymData);
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
