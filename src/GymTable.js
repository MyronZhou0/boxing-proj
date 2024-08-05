import React, { useState, useEffect } from 'react';
import './GymTable.css'; // Import your CSS file
import GymPage from './GymPage';
import SearchBar from './SearchBar';
import Comparison from './Comparison';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Table, TableBody, TableHead, TableCell, TableRow, TableFooter, TablePagination, Button } from '@mui/material';

function GymTable() {
  const location = useLocation();
  const isComparisonPage = location.pathname.startsWith('/comparison/');
  const isGymPage = location.pathname.startsWith('/gyms/');

  // Data from Yelp API
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User input from search bar
  const [locationValue, setLocationValue] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [useSort, setSort] = useState('distance');

  // User input from paginationa
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(10);

  // Input sent to backend with input from search bar
  const [formData, setFormData] = useState({});

  // Input sent to backend with input from comparison
  const [compareData, setCompareData] = useState([]);

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

  useEffect(() => {
    console.log(compareData);
  }, [compareData]); // Trigger whenever compareData changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!gymData) return <div>No data available</div>;

  const handleFormSubmit = (formData) => {
    setFormData(formData);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setCurrentRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleAddToCompare = (gymId, gymName) => {
    if (compareData.length < 2) {
      if (compareData.includes(gymId)) {
        alert(gymName + " has already been added to comparer! Cannot add duplicates.");
      } else {
        setCompareData((prevCompareData) => [...prevCompareData, gymId]); 
        alert(gymName + " has been added to comparer.");
      }
    } else {
      alert("Cannot add more than two to compare. Please remove gym(s) from comparer.");
    }
  };

  return (
    <div>
      {!isComparisonPage && !isGymPage && (
        <>
          <SearchBar
            onFormSubmit={handleFormSubmit}
            locationValue={locationValue}
            setLocationValue={setLocationValue}
            useCurrentLocation={useCurrentLocation}
            setUseCurrentLocation={setUseCurrentLocation}
            currentLatitude={currentLatitude}
            setCurrentLatitude={setCurrentLatitude}
            currentLongitude={currentLongitude}
            setCurrentLongitude={setCurrentLongitude}
            useSort={useSort}
            setSort={setSort}
          />
          <Button
            variant="contained"
            component={Link} 
            to={`/comparison/${compareData[0]}/${compareData[1]}`}
            sx={{marginLeft:"10px"}}
          >
            Compare Gyms
          </Button>
          <div className="tableContainer">
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Gym Name</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Website</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gymData.slice(currentRowsPerPage * currentPage, currentRowsPerPage * (currentPage + 1)).map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link to={`/gyms/${item._id}`}>{item.name}</Link>
                    </TableCell>
                    {/* <TableCell align="center">{item.rating}</TableCell>
                    <TableCell align="center">{item.review_count}</TableCell>
                    <TableCell align="center">{item.price ? item.price : 'N/A'}</TableCell>
                    <TableCell align="center">{item.location.display_address.join(', ')}</TableCell>
                    <TableCell align="center">{(item.distance / 1609.34).toFixed(1)} mi.</TableCell>
                    <TableCell align="center"> */}
                    <TableCell align="center">{item.address}</TableCell>
                    <TableCell align="center">{item.phoneNum}</TableCell>
                    <TableCell align="center"><a href={item.link}>{item.link}</a></TableCell>
                    <TableCell align="center">{item.email}</TableCell>
                    <TableCell align="center">{item.state}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleAddToCompare(item._id, item.name)}>ADD TO COMPARE</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  count={gymData.length}
                  rowsPerPage={currentRowsPerPage}
                  page={currentPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </TableFooter>
            </Table>
          </div>
        </>
      )}
      <Routes>
        <Route path="comparison/:gymId1/:gymId2" element={<Comparison />} />
        <Route path="/gyms/:gymId" element={<GymPage />} />
      </Routes>
    </div>
  );
}

export default GymTable;