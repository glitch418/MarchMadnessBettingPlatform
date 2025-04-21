import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSession } from "../../contexts/UserSessionContext";
import "./Login.css";

import { queryBackend, backendLogin, backendSignUp } from '../../utils/api';

const Login = () => {
  // TODO: forgot password shouldnt take handleSubmit as its onClick method
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUserSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login request");

    if (isLoggedIn) {
      alert("You are already logged in.");
      return;
    }

    let returnedEmail = null;
    let balance = 0;

    try {
      const result = await backendLogin(email, password);
      console.log("Result from backendLogin:", result);
      console.log("Type of result:", typeof result);

      const parts = result.trim().split(/\s+/);
      console.log("Parsed result array:", parts);

      if (parts.length === 5) {
        returnedEmail = parts[2];
        balance = parseFloat(parts[4]);
      }

      if (returnedEmail === email) {
        login(email, balance);
        console.log("Login successful");
        navigate("/");
      } 
      else {
        alert("Login failed. Please check your email and password.");
      }

    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong during login.");
    }
  };

  const handleCreateAccount = async () => {
    try {
      await backendSignUp(email, password);
      alert("Account created! You can now sign in.");
    } catch (error) {
      console.error("Account creation failed:", error);
      alert("Failed to create account.");
    }
  };

  const handleQuery = async (query) => {
    if (!query.trim()) {
      alert('Please enter a valid query.');
      return;
    }

    try {
      const result = await queryBackend(query);
      setQueryResult(result);
    } catch (error) {
      console.error('Query failed:', error);
      setQueryResult('Error executing query.');
    }
  };

  return (
    <div>
      <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', alignSelf:'center', position: 'relative'}}>
      <div 
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vh',
          backgroundColor: '#f0f0f0',
          zIndex: '-1',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '10px'
        }}
      ></div>
        <h2 style={{color:'black'}}>Login</h2>
          <form onSubmit={handleSubmit}>
          <input 
            placeholder="example@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <input 
              type="checkbox" 
              checked={showPassword} 
              onChange={() => setShowPassword(!showPassword)} 
            />
            <p>Show Password</p>
          </div>  
          <button style={{justifyContent:'center', display:'flex', flexDirection:'column', alignSelf:'center', borderRadius:4}}type="submit" disabled={!email.trim() || !password.trim()}>Sign in</button>
        </form>

        <button style={{borderRadius:4}} onClick={handleCreateAccount} type="button">Create Account</button>
        <button sytle={{borderRadius:4}} type="button" onClick={() => alert('Forgot password is not functional yet.')}>Forgot Password?</button>
      </div>
      
    </div>
  );
};

export default Login;
