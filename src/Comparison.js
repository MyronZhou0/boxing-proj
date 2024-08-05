import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import vs from './vs.png';

function Comparison() {
  const { gymId1, gymId2 } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const response = await fetch(`http://localhost:3003/comparison/${gymId1}/${gymId2}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGymData();
  }, [gymId1, gymId2]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!data) return <Typography>No data found</Typography>;

  const { gymData1, gymData2 } = data;

  return (
    <div>
      <Typography variant="h1">Comparison</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <Box sx={{ width: "45%", textAlign: "left" }}>
          <Typography variant="h2">{gymData1[0].name}</Typography>
          <Typography variant="h5">Address: {gymData1[0].address}</Typography>
          <Typography variant="h5">Phone Number: {gymData1[0].phoneNum}</Typography>
          <Typography variant="h5">Website: <a href={gymData1[0].link}>{gymData1[0].link}</a></Typography>
          <Typography variant="h5">State: {gymData1[0].state}</Typography>
        </Box>
        <img src={vs} alt="VS" height="150px" style={{ marginTop: "auto", marginBottom: "auto" }} />
        <Box sx={{ width: "45%", textAlign: "left" }}>
          <Typography variant="h2">{gymData2[0].name}</Typography>
          <Typography variant="h5">Address: {gymData2[0].address}</Typography>
          <Typography variant="h5">Phone Number: {gymData2[0].phoneNum}</Typography>
          <Typography variant="h5">Website: <a href={gymData2[0].link}>{gymData2[0].link}</a></Typography>
          <Typography variant="h5">State: {gymData2[0].state}</Typography>
        </Box>
      </Box>
    </div>
  );
}

export default Comparison;