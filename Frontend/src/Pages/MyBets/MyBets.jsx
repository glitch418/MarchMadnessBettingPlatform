import React from "react";
import { useLoginStatus } from "../../contexts/LoginStatusContext";
import { Navigate } from "react-router-dom";
import "./MyBets.css";

const MyBets = () => {
  const {isLoggedIn, userEmail} = useLoginStatus();
  
  if (!isLoggedIn) {
    return (
    <div>
      <h1>Login to see your bets</h1>
    </div>)
  }
  
  return (
    <div>
      <h1>Hi, {userEmail}!</h1>
    </div>
  )
}
  
export default MyBets;