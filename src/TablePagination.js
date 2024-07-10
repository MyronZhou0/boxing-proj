import React from 'react';
import { Pagination, Box } from '@mui/material';

function TablePagination({
  onFormSubmit,
  locationValue,
  currentLatitude,
  currentLongitude,
  useCurrentLocation,
  useSort,
  currentPage,
  setCurrentPage
}) {

  const handleSubmit = async () => {
    await onFormSubmit({
      location: locationValue,
      latitude: currentLatitude,
      longitude: currentLongitude,
      currentLocation: useCurrentLocation,
      sort: useSort,
      page: currentPage
    });
  };

  const handlePaginationChange = (event, value) => {
    setCurrentPage(value); // Update currentPage directly
    console.log(value);
    handleSubmit(); // Call handleSubmit after updating currentPage
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Ensure the Box takes full width
        margin: '0 auto', // Ensure Box itself is centered if needed
        padding: 0, // Remove any padding
      }}
    >
      <Pagination count={10} size="large" page={currentPage} onChange={handlePaginationChange} sx={{ margin: 0, padding: 0 }} />
    </Box>
  );
}

export default TablePagination;
