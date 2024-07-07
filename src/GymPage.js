import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function GymPage() {
  const { gymId } = useParams(); // Retrieve the gymId parameter from URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [gymId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h2>Gym Details</h2>
      <p>Name: {data.gymData.name}</p>
      <p>Rating: {data.gymData.rating}</p>
      <p>Location: {data.gymData.location.display_address.join(', ')}</p>
      <p>Description: {data.gymData.description}</p>
      <p>Phone: {data.gymData.phone}</p>
      {data.scriptOutput && data.scriptOutput.length > 1 ? (
        <div>
          <p>Monthly Price: ${data.scriptOutput[1]}</p>
          <p>Website: {data.scriptOutput[0]}</p>
        </div>
      ) : (
        <p>Error occurred when finding monthly price or no data available</p>
      )}
      {/* Uncomment the following lines if you want to display reviews */}
      {/* <p>Reviews:</p>
      <ul className="gymList">
        {data.gymData.reviews.map((review, index) => (
          <li key={index}>
            <Review
              user={review.user.name}
              review={review.text}
              rating={review.rating}
            />
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default GymPage;
