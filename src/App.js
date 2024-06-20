// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Gym from './Gym';
import GymPage from './GymPage'; // Assuming you have a GymPage component
import GymTable from './GymTable';

function App() {
  return (
    <GymTable/>
  );
}

export default App;
