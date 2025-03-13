import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
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

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-header">
                    <h1>Sign Up</h1>
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
                        onClick={() => (null)} 
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
  
export default SignUp;