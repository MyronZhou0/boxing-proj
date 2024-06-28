import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

async function getYelpData() {
  const response = await fetch('https://api.yelp.com/v3/businesses/zZAkSRxkrBXgSlFnJe1mlw', {
    headers: {
      'Authorization': 'Bearer YOUR_YELP_API_KEY', // Replace with your actual API Key
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from Yelp API');
  }

  return response.json();
}

// Endpoint to fetch data from Yelp API
app.get('/yelp-data', async (req, res) => {
  try {
    const data = await getYelpData();
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