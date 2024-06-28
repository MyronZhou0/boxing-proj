import React from 'react';
import './GymTable.css'; // Import your CSS file
import Gym from './Gym';
import GymPage from './GymPage';
import { Link, Route, Routes, useRoutes, useLocation } from 'react-router-dom';

// const gymArray = [
//   {gymName: 'Fred', rating: 5, renown: 5, location: '123 Main St', distance: '1m'},
//   {gymName: 'Bobbys', rating: 5, renown: 5, location: '143 Main St', distance: '1m'},
//   {gymName: 'Ace', rating: 5, renown: 5, location: '12 Main St', distance: '1m'},
//   {gymName: 'Canelos', rating: 5, renown: 5, location: '1 Main St', distance: '1m'},
// ];

const gymArray = [
  {gymName: 'Wild Card', id: "zZAkSRxkrBXgSlFnJe1mlw", rating: "?", renown: "?", location: "?", distance: "?"},
  {gymName: "Rounder's MMA", id: "PfU_CgDIrZk6OdqoVF9cig", rating: "?", renown: "?", location: "?", distance: "?"},
  {gymName: "Gleason's Gym", id: "WzFLaf_59vDo-5P1Xyn3-A", rating: "?", renown: "?", location: "?", distance: "?"},
]

function GymTable() {
  const location = useLocation();

  const isGymPage = location.pathname.startsWith('/gyms/');

  return (
    <div>
      {!isGymPage && (
        <div className="tableContainer">
          <ul className="tableHead">
            <li>Gym Name</li>
            <li>Rating</li>
            <li>Renown</li>
            <li>Address</li>
            <li>Distance</li>
          </ul>
          <ul className="gymList">
            {gymArray.map((item, index) => (
              <li key={index}>
                <Gym
                  gymName={<Link to={`/gyms/${index}`}>{item.gymName}</Link>}
                  rating={item.rating}
                  renown={item.renown}
                  location={item.location}
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
