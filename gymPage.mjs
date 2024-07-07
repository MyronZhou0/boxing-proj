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

console.log("start");

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
    console.log(gymData);
    const yelpUrl = gymData.url;
    console.log(yelpUrl);

    // Invoke Python script with yelpUrl as argument
    exec(`python3 webscraper/webscraper.py ${yelpUrl}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: 'Failed to execute Python script' });
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      console.log(`stdout: ${stdout}`);

      let scriptOutput;
      try {
        scriptOutput = JSON.parse(stdout);
      } catch (parseError) {
        console.error('Failed to parse Python script output:', parseError);
      }
      
      // Send the combined data
      res.status(200).json({
        gymData: gymData,
        scriptOutput: scriptOutput
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Yelp API' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
