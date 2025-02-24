import React from "react";
import { useState } from "react";
import "./Login.css";

const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    return (
     <div>
        <form onSubmit={() => (null)}>
            <input placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)}/>
            <input type={showPassword ? "text" : "password"} placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
            <div>
            <input onChange={() => setShowPassword(!showPassword)} type="checkbox"/>
            <p> Show Password</p>
            </div>
        </form>
     </div>
    )
  }
  
  export default Login;