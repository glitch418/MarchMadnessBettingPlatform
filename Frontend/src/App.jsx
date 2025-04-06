import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import MyBets from './Pages/MyBets/MyBets';
import { LoginStatusProvider } from './contexts/LoginStatusContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <LoginStatusProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myBets" element={<MyBets />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </LoginStatusProvider>
  );
};

export default App;
