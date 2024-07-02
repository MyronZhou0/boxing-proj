import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function GymPage() {
  const { gymId } = useParams(); // Retrieve the gymId parameter from URL
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(gymId);
  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const response = await fetch(`http://localhost:3002/gymPage/${gymId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const data = await response.json();
        setGymData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGymData();
  }, [gymId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!gymData) return <div>No data available</div>;
  console.log(gymData);
  return (
    <div>
      <h2>Gym Details</h2>
      <p>Name: {gymData.name}</p>
      <p>Rating: {gymData.rating}</p>
      <p>Location: {gymData.location.display_address}</p>
      <p>Description: {gymData.description}</p>
      <p>Phone: {gymData.phone}</p>
      <p>Price: {gymData.price}</p>
      <p>Website: {gymData.url}</p>
      {/* <p>Reviews:</p>
      <ul className="gymList">
        {gymData.reviews.map((review, index) => (
          <li key={index}>
            <Review
              user={review.user.name}
              review={review.text}
              rating={review.rating}
            />
          </li>
        ))} */}
      {/* </ul> */}
    </div>
  );
}

export default GymPage;
