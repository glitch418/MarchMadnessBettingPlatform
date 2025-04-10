import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import MyBets from './Pages/MyBets/MyBets';
import PlaceBet from './Pages/PlaceBet/PlaceBet';
import { LoginStatusProvider } from './contexts/LoginStatusContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
      <LoginStatusProvider>
        <Router> {/* Provides routing context */}
          <Routes> {/* Container that matches routes */}

            {/* Default path directs user to home page */}
            <Route path="/" element={<Home />} />

            {/* Login Page */}
            <Route path="/login" element={<Login/>} />
            {/* Sign up page */}
            {/* <Route path="/signup" element={<SignUp/>} /> */}

            {/* TODO: Profile page */}
            {/* <Route path="/profile" element={<Profile/>} /> */}

            {/* MyBets Page */}
            <Route path="/myBets" element={<MyBets/>} />

            {/* PlaceBet Page */}
            <Route path="/placeBet" element={<PlaceBet />} />

            {/* Any undefined paths redirect to Home */}
            <Route path="*" element={<Home/>} />
          </Routes>
        </Router>
      </LoginStatusProvider>
  );
};

export default App;
