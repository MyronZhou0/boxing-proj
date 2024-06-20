// Gym.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Gym.css';

function Gym(props) {
  return (
    <div>
      <ul className="Gym-ul">
        <li>
          {/* <Link to={`/gyms/${props.gymId}`}>{props.gymName}</Link> */}
        </li>
        <li>{props.rating}</li>
        <li>{props.renown}</li>
        <li>{props.location}</li>
        <li>{props.distance}</li>
      </ul>
    </div>
  );
}

export default Gym;
