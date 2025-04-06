import React from "react";
import { useLoginStatus } from "../../contexts/LoginStatusContext";
import { Navigate } from "react-router-dom";
import "./MyBets.css";

const MyBets = () => {
   const { isLoggedIn} = useLoginStatus();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <h1>Hi, {userEmail}!</h1>
    </div>
  )
}
  
export default MyBets;