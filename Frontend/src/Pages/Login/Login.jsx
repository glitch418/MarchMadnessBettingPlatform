import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "../../components/Navbar/Navbar";

// Import the backend query function using HTTP
import { queryBackend } from '../../utils/api';

const Login = () => {
    // States to manage user input
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [queryInput, setQueryInput] = useState('');
      const [queryResult, setQueryResult] = useState('');
    const navigate = useNavigate();

    // On sign in
    function handleSubmit(e) {
        e.preventDefault();
        
        //TODO: check credentials
        if (handleLogin()){
            navigate("/");
        }
    }

    // Function to handle backend query using HTTP
      const handleQuery = async (query) => {
        console.log("running...");
        if (!query.trim()) {
          alert('Please enter a valid query.');
          return;
        }
        
        try {
          console.log("running...");
            const result = await queryBackend(query); // Send custom query via HTTP
            console.log(result);
            setQueryResult(result); 
            return result;// Display results
        } catch (error) {
          console.error('Query failed:', error);
          setQueryResult('Error executing query.');
        }
      };

      function handleCreateAccount() {
        let x = ("INSERT INTO users (username, email, password_hash) VALUES ('" + email + "', '" + email + "', '" + password + "')");
        handleQuery(x);
      }

      function handleLogin() {
        let x = ("SELECT * FROM users WHERE email = '" + email + "' AND password_hash = '" + password + "'");
        handleQuery(x);
      }

    return (
        <div>
            {/*TODO: update handle submit */}
            <form onSubmit={handleSubmit}>
                <input placeholder="example@email.com" onChange={(e) => {setEmail(e.target.value);}}/>
                <input type={showPassword ? "text" : "password"} placeholder="password" onChange={(e) => {setPassword(e.target.value);}}/>
                <div><input onChange={() => setShowPassword(!showPassword)} type="checkbox"/> <p> Show Password</p></div>  
                <button type="submit" disabled={!email.trim() || !password.trim()}>Sign in</button>
            </form>

            {/*TODO: handle create account */}
            <button onClick={handleCreateAccount} type="button">Create Account</button>

            {/*TODO: handle forgot password */}
            <button type="button" onClick={() => (console.log(queryInput))}>Forgot Password?</button>
        </div>
    );
};
  
export default Login;