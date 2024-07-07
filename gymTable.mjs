import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

let formData = {};

app.use(cors());
app.use(express.json());

const yelpApiKey = process.env.YELP_API_KEY;

async function getGymsData() {
  let url;

  if (formData.currentLocation) {
    url = `https://api.yelp.com/v3/businesses/search?latitude=${formData.latitude}&longitude=${formData.longitude}&categories=boxing&limit=10&sort_by=rating`;
  } else if (formData.location !== "") {
    const encodedLocation = encodeURIComponent(formData.location);
    url = `https://api.yelp.com/v3/businesses/search?location=${encodedLocation}&categories=boxing&limit=10&sort_by=rating`;
  } else {
    url = `https://api.yelp.com/v3/businesses/search?location=Los%20Angeles&categories=boxing&limit=10&sort_by=rating`;
  }

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

app.post('/gymTable', async (req, res) => {
  try {
    formData = req.body;
    // IF FORM DATA IS EMPTY MEANING THAT THE PAGE IS INITIALLY LOADED THEN USE THESE DEFAULT VALUES
    if (Object.keys(formData).length === 0) {
      formData = {
        location: "Los Angeles",
        latitude: 0,
        longitude: 0,
        currentLocation: false
      };
    }

    console.log(formData);
    const gymData = await getGymsData();
    res.json(gymData.businesses);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Yelp API' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
