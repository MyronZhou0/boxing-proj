// GymForm.js
import React, { useState } from 'react';
import { Checkbox, TextField, Button, Select, MenuItem } from '@mui/material';

import "./SearchBar.css"

function SearchBar({ onFormSubmit, locationValue, setLocationValue, useCurrentLocation, setUseCurrentLocation, setSort, useSort, currentPage }) {
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition);
    } else {
      console.log("CANNOT USE CURRENT LOCATION PLEASE GIVE PERMISSIONS");
    }
    onFormSubmit({ location: locationValue, latitude: currentLatitude, longitude: currentLongitude, currentLocation: useCurrentLocation, sort: useSort, page: currentPage });
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

  function handleSortSelect(event) {
    setSort(event.target.value);
  }
  return (
    <div>
    <form onSubmit={handleSubmit} className="searchForm">
      <TextField label="Location" variant="outlined" margin="normal" fullwidth value={locationValue} onChange={handleLocationChange}
      sx={{ marginRight: 1, marginLeft: 2 }}></TextField>
      <label htmlFor="locationCheckbox" style={{ display: 'flex', alignItems: 'center' }}> Use Current Location: </label>
      <Checkbox id="locationCheckbox"value={useCurrentLocation} onChange = {handleLocationChecked}/>
      <label htmlFor="sortSelect" style={{ display: 'flex', alignItems: 'center' }}>Sort By: </label>
      <Select id="sortSelect" onChange = {handleSortSelect} defaultValue = {useSort} sx={{marginLeft: "5px", marginRight: "10px"}}>
        <MenuItem value={"distance"}>Distance</MenuItem>
        <MenuItem value={"rating"}>Rating</MenuItem>
        <MenuItem value={"review_count"}>Review Count</MenuItem>
      </Select>
      <Button variant="contained" type="submit" size="large" sx={{height: "50px", marginTop: "18px"}}>Search</Button>
    </form>
    </div>
  );
}

export default SearchBar;