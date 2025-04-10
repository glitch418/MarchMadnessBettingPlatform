import React from "react";
import { useUserSession } from "../../contexts/UserSessionContext";
import "./MyBets.css";

const MyBets = () => {
  const {isLoggedIn, userEmail} = useUserSession();
  
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