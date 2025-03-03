import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Game from './components/Game/Game';

// Import the backend query function
import { queryBackend } from './utils/socket';

const App = () => {
  // State for handling query input and results
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState('');

  // Function to handle backend query
  const handleQuery = async () => {
    if (!queryInput.trim()) {
      alert('Please enter a valid query.');
      return;
    }

    try {
      const result = await queryBackend(queryInput); // Send custom query
      setQueryResult(result); // Display results
    } catch (error) {
      console.error('Query failed:', error);
      setQueryResult('Error executing query.');
    }
  };

  return (
    <>
      {/* Original Routing Code (Untouched) */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* TODO: Sign up page */}
          {/* TODO: Protect routes based on login status */}
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>

      {/* New Feature: Custom Query Input and Results */}
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
        <h2>Test Custom Backend Query</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Enter SQL query (e.g., SELECT * FROM bets)"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
          <button onClick={handleQuery} style={{ padding: '8px 16px' }}>
            Run Query
          </button>
        </div>
        <pre style={{ backgroundColor: '#eaeaea', padding: '10px', minHeight: '100px' }}>
          {queryResult || 'No query run yet.'}
        </pre>
      </div>
    </>
  );
};

export default App;
