import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function GymPage() {
  const { gymId } = useParams(); // Retrieve the gymId parameter from URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let priceHTML = null;
  let errorHTML = null;

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const response = await fetch(`http://localhost:3002/gymPage/${gymId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGymData();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;
  console.log(data);

  if("price" in data.scriptOutput){
    priceHTML = <p>Monthly Price: ${data.scriptOutput.price}</p>
  }
  if("error" in data.scriptOutput){
    errorHTML = <p>Error: {data.scriptOutput.error}</p>
  }

  return (
    <div>
      <h2>Gym Details</h2>
      <p>Name: {data.gymData.name}</p>
      <p>Rating: {data.gymData.rating}</p>
      <p>Location: {data.gymData.location.display_address.join(', ')}</p>
      <p>Description: {data.scriptOutput.desc}</p>
      <p>Phone: {data.gymData.phone}</p>
        <div>
          {priceHTML}
          {errorHTML}
          <a href={data.scriptOutput.url}>{data.scriptOutput.url}</a>
        </div>
    </div>
  );
}

export default GymPage;
