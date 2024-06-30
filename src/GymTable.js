import React, { useState, useEffect } from 'react';
import './GymTable.css'; // Import your CSS file
import Gym from './Gym';
import GymPage from './GymPage';
import { Link, Route, Routes, useRoutes, useLocation } from 'react-router-dom';

function GymTable() {
  const location = useLocation();

  const isGymPage = location.pathname.startsWith('/gyms/');

  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const gymArray = [
  //   {gymName: 'Wild Card', id: "zZAkSRxkrBXgSlFnJe1mlw", rating: "?", renown: "?", location: "?", distance: "?"},
  //   {gymName: "Rounder's MMA", id: "PfU_CgDIrZk6OdqoVF9cig", rating: "?", renown: "?", location: "?", distance: "?"},
  //   {gymName: "Gleason's Gym", id: "WzFLaf_59vDo-5P1Xyn3-A", rating: "?", renown: "?", location: "?", distance: "?"},
  // ]
  useEffect(() => {
    const fetchGymsData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/gymTable`);
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
  });

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
if (!gymData) return <div>No data available</div>;
console.log(gymData);
  // return (
  //   <div>
  //     {!isGymPage && (
  //       <div className="tableContainer">
  //         <ul className="tableHead">
  //           <li>Gym Name</li>
  //           <li>Rating</li>
  //           <li>Renown</li>
  //           <li>Address</li>
  //           <li>Distance</li>
  //         </ul>
  //         <ul className="gymList">
  //           {gymArray.map((item) => (
  //             <li key={item.id}>
  //               <Gym
  //                 gymName={<Link to={`/gyms/${item.id}`}>{item.gymName}</Link>}
  //                 rating={item.rating}
  //                 renown={item.renown}
  //                 location={item.location}
  //                 distance={item.distance}
  //               />
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     )}
  //     <Routes>
  //       <Route path="/gyms/:gymId" element={<GymPage />} />
  //     </Routes>
  //   </div>
  // );
}

export default GymTable;
