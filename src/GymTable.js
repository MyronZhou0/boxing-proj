import React, { useState, useEffect } from 'react';
import './GymTable.css'; // Import your CSS file
import Gym from './Gym';
import GymPage from './GymPage';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

function GymTable() {
  const location = useLocation();
  const isGymPage = location.pathname.startsWith('/gyms/');

  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGymsData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/gymTable`);
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
    fetchGymsData();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!gymData) return <div>No data available</div>;
  console.log(gymData)
  return (
    <div>
      {!isGymPage && (
        <div className="tableContainer">
          <ul className="tableHead">
            <li>Gym Name</li>
            <li>Rating</li>
            <li>Review Count</li>
            <li>Renown</li>
            <li>Address</li>
            <li>Distance</li>
          </ul>
          <ul className="gymList">
            {gymData.map((item) => (
              <li key={item.id}>
                <Gym
                  gymName={<Link to={`/gyms/${item.id}`}>{item.name}</Link>}
                  rating={item.rating}
                  reviewCount={item.review_count}
                  renown={item.renown}
                  location={item.location.display_address}
                  distance={item.distance}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <Routes>
        <Route path="/gyms/:gymId" element={<GymPage />} />
      </Routes>
    </div>
  );
}

export default GymTable;