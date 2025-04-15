import React from "react";
import { useUserSession } from "../../contexts/UserSessionContext";
import "./Profile.css";

const Profile = () => {
  const {isLoggedIn, userEmail, balance, login, logout, updateBalance} = useUserSession();
  
  if (!isLoggedIn) {
    return (
    <div>
      <h1>Login to see your profile</h1>
    </div>)
  }
  
  return (
    <div>
      <h1>Hi, {userEmail}!</h1>
    </div>
  )
}
  
export default Profile;