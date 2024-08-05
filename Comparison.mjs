import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';


// Connection URL
const url = 'mongodb://localhost:27017'; 
const client = new MongoClient(url);

// Database and collection names
const dbName = 'registeredGyms'; 
const collectionName = 'gyms_collection';

console.log("WTF");
// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // To parse JSON bodies

//const yelpApiKey = process.env.YELP_API_KEY; // Secure API key

async function getGymData(businessId) {
  let gyms = []
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to server');

    // Select the database and collection
    console.log(typeof businessId);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    let mongoId = ObjectId.createFromHexString(businessId);

    // Find all documents in the collection
    gyms = await collection.find({_id: mongoId}).toArray();

    // Log the documents
    console.log('Documents:', gyms);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    await client.close();
  }
  return gyms;
}

// Endpoint to fetch data from Yelp API
// Activates when the link to comparison is clicked and request is sent to the backend
app.get('/comparison/:businessId1/:businessId2', async (req, res) => {
  const { businessId1, businessId2 } = req.params;
  console.log(businessId1, businessId2);
  try {
    const gymData1 = await getGymData(businessId1);
    const gymData2 = await getGymData(businessId2);
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
