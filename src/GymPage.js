// GymPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

function GymPage() {
  let { gymId } = useParams(); // Retrieve the gymId parameter from URL

  // Fetch gym details based on gymId and render
  return (
    <div>
      <h2>Gym Details</h2>
      <p>Gym ID: {gymId}</p>
      {/* Render gym details based on gymId */}
    </div>
  );
}

export default GymPage;
