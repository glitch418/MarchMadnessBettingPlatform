import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Import the backend query function using HTTP
import { queryBackend } from '../../utils/api';

const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [queryInput, setQueryInput] = useState('');
      const [queryResult, setQueryResult] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        
        //TODO: check credentials
        if (true){
            navigate("/");
        }
    }

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
          console.error('Query failed:', error);
          setQueryResult('Error executing query.');
        }
      };

      function handleCreateAccount(){
        //console.log("try to create account");
        return "INSERT INTO users (username, email, password_hash) VALUES ('" + email + "', '" + email + "1', '" + password + "')";
      }

    return (
        <div>
            {/*TODO: update handle submit */}
            <form onSubmit={handleSubmit}>
                <input placeholder="example@email.com" onChange={(e) => {setEmail(e.target.value); setQueryInput(handleCreateAccount())}}/>
                <input type={showPassword ? "text" : "password"} placeholder="password" onChange={(e) => {setPassword(e.target.value); setQueryInput(handleCreateAccount());}}/>
                <div><input onChange={() => setShowPassword(!showPassword)} type="checkbox"/> <p> Show Password</p></div>  
                <button type="submit" disabled={!email.trim() || !password.trim()}>Sign in</button>
            </form>

            {/*TODO: handle create account */}
            <button onClick={handleQuery} type="button">Create Account</button>

            {/*TODO: handle forgot password */}
            <button type="button" onClick={() => (console.log(queryInput))}>Forgot Password?</button>
        </div>
    )
}
  
  export default Login;