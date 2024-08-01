// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Logo from "./Logo";
import GymTable from './GymTable';
import './App.css'


function App() {
  return (
    <div>
      <Logo/>
      <GymTable/>
    </div>
  );
}

export default App;
