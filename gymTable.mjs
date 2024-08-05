import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';


// Connection URL
const url = 'mongodb://localhost:27017'; 
const client = new MongoClient(url);

// Database and collection names
const dbName = 'registeredGyms'; // Replace with your database name
const collectionName = 'gyms_collection'; // Replace with your collection name

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

let formData = {};

app.use(cors());
app.use(express.json());

//const yelpApiKey = process.env.YELP_API_KEY;

async function getGymsData() {
  //CODE FOR YELP FUSION DATA

  // let url;
  // if (formData.currentLocation) {
  //   url = `https://api.yelp.com/v3/businesses/search?latitude=${formData.latitude}&longitude=${formData.longitude}&categories=boxing&sort_by=${formData.sort}&limit=50`;
  // } else if (formData.location !== "") {
  //   const encodedLocation = encodeURIComponent(formData.location);
  //   url = `https://api.yelp.com/v3/businesses/search?location=${encodedLocation}&categories=boxing&sort_by=${formData.sort}&limit=50`;
  // } else {
  //   url = `https://api.yelp.com/v3/businesses/search?location=Los%20Angeles&categories=boxing&sort_by=${formData.sort}&limit=50`;
  // }

  // const response = await fetch(url, {
  //   headers: {
  //     'Authorization': `Bearer ${yelpApiKey}`,
  //     'Accept': 'application/json'
  //   }
  // });
  let gyms;
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to server');

    // Select the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Find all documents in the collection
    gyms = await collection.find({}).toArray();

    // Log the documents
    console.log('Documents:', gyms);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    await client.close();
  }
  return gyms;
  //YELP CODE

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   const errorMessage = `Failed to fetch data from Yelp API. Status: ${response.status}, Response: ${errorText}`;
  //   throw new Error(errorMessage);
  // }
  // return response.json();
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
        currentLocation: false,
        sort: "distance",
        page: 1
      };
    }

    console.log(formData);
    const gymData = await getGymsData();
    // res.json(gymData.businesses);
    res.json(gymData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data MongoDB' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
