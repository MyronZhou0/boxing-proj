import React, { useState, useEffect } from 'react';
import './GymTable.css'; // Import your CSS file
//import Gym from './Gym';
import GymPage from './GymPage';
import SearchBar from './SearchBar';
import TablePagination from './TablePagination';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Table, TableBody, TableHead, TableCell, TableRow } from '@mui/material';


function GymTable() {
  const location = useLocation();
  const isGymPage = location.pathname.startsWith('/gyms/');
  //data from yelp api
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //user input from search bar
  const [locationValue, setLocationValue] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [useSort, setSort] = useState("distance");
  //user input from pagination
  const [currentPage, setCurrentPage] = useState(1);
  //input sent to backend with input from search bar and pagination
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
        currentLatitude = {currentLatitude}
        setCurrentLatitude = {setCurrentLatitude}
        currentLongitude = {currentLongitude}
        setCurrentLongitude = {setCurrentLongitude}
        useSort={useSort}
        setSort={setSort}
        currentPage={currentPage}
      />
      {!isGymPage && (
        <div className="tableContainer">
          <Table sx={{ minWidth: 650 }}>
          <TableHead>
          <TableRow>
            <TableCell style={{fontWeight: "bold"}}>Gym Name</TableCell>
            <TableCell align="center" style={{fontWeight: "bold"}}>Rating</TableCell>
            <TableCell align="center" style={{fontWeight: "bold"}}>Review Count</TableCell>
            <TableCell align="center" style={{fontWeight: "bold"}}>Price</TableCell>
            <TableCell align="center" style={{fontWeight: "bold"}}>Address</TableCell>
            <TableCell align="center" style={{fontWeight: "bold"}}>Distance (Miles)</TableCell>
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
              <TableCell align="center">{item.location.display_address.join(", ")}</TableCell>
              <TableCell align="center">{(item.distance/1609.34).toFixed(1)} mi.</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
        </div>
      )}
      <Routes>
        <Route path="/gyms/:gymId" element={<GymPage />} />
      </Routes>
      <TablePagination
          onFormSubmit={handleFormSubmit}
          locationValue={locationValue}
          useCurrentLocation={useCurrentLocation}
          currentLatitude={currentLatitude}
          currentLongitude={currentLongitude}
          useSort={useSort}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}/>
    </div>
  );
}

export default GymTable;
