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

  const [locationValue, setLocationValue] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  // RUNS ONCE WHEN COMPONENT IS RENDERED AND AGAIN ONCE FORM DATA IS CHANGED
  useEffect(() => {
    const fetchGymsData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/gymTable`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

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
  }, [formData]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!gymData) return <div>No data available</div>;
  console.log(gymData)

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition)
    }
    else
    {
      console.log("CANNOT USE CURRENT LOCATION PLEASE GIVE PERMISSIONS");
    }
      setFormData({location: locationValue, latitude: currentLatitude, longitude: currentLongitude, currentLocation: useCurrentLocation})
  }

  function getPosition(position){
    setCurrentLatitude(position.coords.latitude);
    setCurrentLongitude(position.coords.longitude);
  }

  function handleLocationChange(event) {
    setLocationValue(event.target.value)
  }
  function handleLocationChecked(event) {
    setUseCurrentLocation(event.target.checked)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="locationInput">Location: </label>
          <input type="text" id="locationInput" value={locationValue} onChange={handleLocationChange}/>
          <label htmlFor="currentLocation">Use Current Location</label>
          <input type="checkbox" id="currentLocation" checked={useCurrentLocation} onChange={handleLocationChecked}/>
          <input type="submit"/>
        </form>
      </div>
      {!isGymPage && (
        <div className="tableContainer">
          <ul className="tableHead">
            <li>Gym Name</li>
            <li>Rating</li>
            <li>Review Count</li>
            <li>Renown</li>
            <li>Price</li>
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
                  price={item.price}
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