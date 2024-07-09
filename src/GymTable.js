import React, { useState, useEffect } from 'react';
import './GymTable.css'; // Import your CSS file
import Gym from './Gym';
import GymPage from './GymPage';
import SearchBar from './SearchBar';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Table, TableBody, TableHead, TableCell, TableContainer, TableRow } from '@mui/material';


function GymTable() {
  const location = useLocation();
  const isGymPage = location.pathname.startsWith('/gyms/');

  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [locationValue, setLocationValue] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [formData, setFormData] = useState({});

  // RUNS ONCE WHEN COMPONENT IS RENDERED AND AGAIN ONCE FORM DATA IS CHANGED
  useEffect(() => {
    const fetchGymsData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/gymTable`, {
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
  console.log(gymData);
  const handleFormSubmit = (formData) => {
    setFormData(formData);
  };

  return (
    <div>
      <SearchBar
        onFormSubmit={handleFormSubmit}
        locationValue={locationValue}
        setLocationValue={setLocationValue}
        useCurrentLocation={useCurrentLocation}
        setUseCurrentLocation={setUseCurrentLocation}
      />
      {!isGymPage && (
        <div className="tableContainer">
          <Table sx={{ minWidth: 650 }}>
          <TableHead>
          <TableRow>
            <TableCell>Gym Name</TableCell>
            <TableCell align="center">Rating</TableCell>
            <TableCell align="center">Review Count</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Address</TableCell>
            <TableCell align="center">Distance (Miles)</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
          {gymData.map((item) => (
            <TableRow
              key={item.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              <Link to={`/gyms/${item.id}`}>{item.name}</Link>
              </TableCell>
              <TableCell align="center">{item.rating}</TableCell>
              <TableCell align="center">{item.review_count}</TableCell>
              <TableCell align="center">{item.price ? item.price : "N/A"}</TableCell>
              <TableCell align="center">{item.location.display_address}</TableCell>
              <TableCell align="center">{(item.distance/1609.34).toFixed(1)} mi.</TableCell>
            </TableRow>
          ))}
        </TableBody>
          </Table>
          {/* <ul className="tableHead">
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
          </ul> */}
        </div>
      )}
      <Routes>
        <Route path="/gyms/:gymId" element={<GymPage />} />
      </Routes>
    </div>
  );
}

export default GymTable;
