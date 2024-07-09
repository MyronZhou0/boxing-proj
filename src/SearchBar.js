// GymForm.js
import React, { useState } from 'react';
import { Checkbox, TextField, Button} from '@mui/material';

import "./SearchBar.css"

function SearchBar({ onFormSubmit, locationValue, setLocationValue, useCurrentLocation, setUseCurrentLocation }) {
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition);
    } else {
      console.log("CANNOT USE CURRENT LOCATION PLEASE GIVE PERMISSIONS");
    }
    onFormSubmit({ location: locationValue, latitude: currentLatitude, longitude: currentLongitude, currentLocation: useCurrentLocation });
  };

  function getPosition(position) {
    setCurrentLatitude(position.coords.latitude);
    setCurrentLongitude(position.coords.longitude);
  }

  function handleLocationChange(event) {
    setLocationValue(event.target.value);
  }

  function handleLocationChecked(event) {
    setUseCurrentLocation(event.target.checked);
  }

  return (
    <div>
    <form onSubmit={handleSubmit} className="searchForm">
      <TextField label="Location" variant="outlined" margin="normal" fullwidth value={locationValue} onChange={handleLocationChange}
      sx={{ marginRight: 1, marginLeft: 2 }}></TextField>
      <label htmlFor="locationCheckbox" style={{ display: 'flex', alignItems: 'center' }}> Use current location</label>
      <Checkbox id="locationCheckbox"value={useCurrentLocation} onChange = {handleLocationChecked}/>
      <Button variant="contained" type="submit" size="large" sx={{height: "50px", marginTop: "18px"}}>Search</Button>
    </form>
    </div>
  );
}

export default SearchBar;