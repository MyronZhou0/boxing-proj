import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Typography, Box} from '@mui/material';
import vs from './vs.png';

function Comparison(){
    // Data from Yelp API
    const gymId1 = useParams().gymId1; // Retrieve the gymId parameter from URL
    const gymId2 = useParams().gymId2; 
    console.log(gymId1);
    console.log(gymId2);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let priceHTML = null;
    let errorHTML = null;

    useEffect(() => {
        const fetchGymData = async () => {
        try {
            const response = await fetch(`http://localhost:3003/comparison/${gymId1}/${gymId2}`);
            if (!response.ok) 
            {
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
  },[]);
  console.log(data);
    return(
        <div>
            <Typography variant="h1">
                Comparison
            </Typography>
            <Box sx={{display: "flex",
            justifyContent: "space-between",
            padding: "20px"}}>
                <Box sx={{alignText: "left"}}>
                    <Typography variant="h2">
                        {data.gymData1.name}
                    </Typography>
                    <Typography variant="h5">
                        Rating: {data.gymData1.rating}
                    </Typography>
                    <Typography variant="h5">
                        Review Count: {data.gymData1.review_count}
                    </Typography>
                    <Typography variant="h5">
                        Address: {data.gymData1.location.display_address.join(', ')}
                    </Typography>
                    <Typography variant="h5">
                        Distance: {(data.gymData1.distance / 1609.34).toFixed(1)}
                    </Typography>
                </Box>
                <img src={vs} alt="VS Image" height="150px" style={{marginTop:"200px"}}/>
                <Box>
                <Typography variant="h2">
                        {data.gymData2.name}
                    </Typography>
                    <Typography variant="h5">
                        Rating: {data.gymData2.rating}
                    </Typography>
                    <Typography variant="h5">
                        Review Count: {data.gymData2.review_count}
                    </Typography>
                    <Typography variant="h5">
                        Address: {data.gymData2.location.display_address.join(', ')}
                    </Typography>
                    <Typography variant="h5">
                        Distance: {(data.gymData2.distance / 1609.34).toFixed(1)}
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

export default Comparison;