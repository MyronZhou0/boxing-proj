import React from 'react';
import './GymTable.css'; // Import your CSS file
import Gym from './Gym';

const gymArray = [
  {gymName: 'Fred', rating: 5, renown: 5, location: '123 Main St', distance: '1m'},
  {gymName: 'Bobbys', rating: 5, renown: 5, location: '143 Main St', distance: '1m'},
  {gymName: 'Ace', rating: 5, renown: 5, location: '12 Main St', distance: '1m'},
  {gymName: 'Canelos', rating: 5, renown: 5, location: '1 Main St', distance: '1m'},
];

function GymTable() {
  return (
    <div className="tableContainer">
      <ul className="tableHead">
        <li>Name</li>
        <li>Rating</li>
        <li>Renown</li>
        <li>Address</li>
        <li>Distance</li>
      </ul>
      <ul className="gymList">
        {gymArray.map((item, index) => (
          <li key={index}>
            <Gym gymName={item.gymName} rating={item.rating} renown={item.renown} location={item.location} distance={item.distance} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GymTable;
