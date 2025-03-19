import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import MyBets from './Pages/MyBets/MyBets';

const App = () => {
  // State for handling query input and results
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState('');

  // Function to handle backend query using HTTP
  const handleQuery = async () => {
    console.log("running...");
    if (!queryInput.trim()) {
      alert('Please enter a valid query.');
      return;
    }

    try {
      console.log("running...");
      const result = await queryBackend(queryInput); // Send custom query via HTTP
      console.log(result);
      setQueryResult(result); // Display results
    } catch (error) {
      console.log(result);
      console.error('Query failed:', error);
      setQueryResult('Error executing query.');
    }
  };

  return (
      <Router> {/* Provides routing context */}
        <Routes> {/* Container that matches routes */}
          {/* Individual route definitions */}

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

          {/* Any undefined paths redirect to Home */}
          <Route path="*" element={<Home/>} />
        </Routes>
      </Router>
  );
};

export default App;
