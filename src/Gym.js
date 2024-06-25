// Gym.js
import React from 'react';
import './Gym.css';

function Gym(props) {
  return (
    <div>
      <ul className="Gym-ul">
        <li>{props.gymName}</li>
        <li>{props.rating}</li>
        <li>{props.renown}</li>
        <li>{props.location}</li>
        <li>{props.distance}</li>
      </ul>
    </div>
  );
}

export default Gym;
