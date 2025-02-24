import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Game from './components/Game/Game';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        {/* TODO: Sign up page */}

        {/* TODO: Protect routes based on login status */}
        <Route path="/" element={<Home />} />

        {/* Any undefined paths redirect to login */}
        <Route path="*" element={<Login/>} />
      </Routes>
  </Router>
  )
}

export default App;
