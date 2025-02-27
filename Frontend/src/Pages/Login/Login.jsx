import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        
        //TODO: check credentials
        if (true){
            navigate("/");
        }
    }

    return (
        <div>
            {/*TODO: update handle submit */}
            <form onSubmit={handleSubmit}>
                <input placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)}/>
                <input type={showPassword ? "text" : "password"} placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                <div><input onChange={() => setShowPassword(!showPassword)} type="checkbox"/> <p> Show Password</p></div>  
                <button type="submit" disabled={!email.trim() || !password.trim()}>Sign in</button>
            </form>

            {/*TODO: handle create account */}
            <button onClick={() => (null)} type="button">Create Account</button>

            {/*TODO: handle forgot password */}
            <button type="button" onClick={() => (null)}>Forgot Password?</button>
        </div>
    )
}
  
  export default Login;