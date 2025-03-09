import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "../../components/Navbar/Navbar";

const Login = () => {
    // States to manage user input
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Enable routing
    const navigate = useNavigate();

    // On sign in
    function handleSubmit(e) {
        e.preventDefault();
        
        //TODO: check credentials
        if (true){
            navigate("/");
        }
    }

    // On create account
    function handleCreateAccount(e) {
        navigate("/signup");
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-header">
                    <h1>Sign In</h1>
                </div>
                
                {/*TODO: update handle submit */}
                <form onSubmit={handleSubmit}>
                    <div className="input">
                        <input 
                            type="email"
                            placeholder="johndoe@email.com" 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="input">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="password" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="checkbox">
                        <input 
                            id="show-password"
                            onChange={() => setShowPassword(!showPassword)} 
                            type="checkbox"
                        /> 
                        <p>Show Password</p>
                    </div>  
                    
                    <button 
                        className="submit" 
                        type="submit" 
                        disabled={!email.trim() || !password.trim()}
                    >
                        Sign in
                    </button>
                </form>

                <div className="actions">
                    {/*TODO: handle create account */}
                    <button 
                        className="create-account-btn"
                        onClick={handleCreateAccount} 
                        type="button"
                    >
                        Create Account
                    </button>

                    {/*TODO: handle forgot password */}
                    <button 
                        className="forgot-password-btn" 
                        type="button" 
                        onClick={() => (null)}
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    );
};
  
export default Login;