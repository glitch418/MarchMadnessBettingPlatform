import React, { useState } from "react";
import { useUserSession } from "../../contexts/UserSessionContext";
import { changeBalance } from "../../utils/api";
import "./Profile.css";

const Profile = () => {
  const [newBalance, setNewBalance] = useState("");
  const {isLoggedIn, userEmail, balance, login, logout, updateBalance} = useUserSession();

  const handleBalanceUpdate = async () => {
    try {
      let a = parseInt(balance) + parseInt(newBalance);
      updateBalance(a);
      await changeBalance(userEmail, (a));
      alert("Balance Updated");
    } catch (error) {
      console.error("Balance update failed", error);
      alert("Failed to update balance");
    }
  };

  const handleBalanceWithdraw = async () => {
    try {
      let a = parseInt(balance) - parseInt(newBalance);
      updateBalance(a);
      await changeBalance(userEmail, (a));
      alert("Balance Updated");
    } catch (error) {
      console.error("Balance update failed", error);
      alert("Failed to update balance");
    }
  };
  
  if (!isLoggedIn) {
    return (
    <div>
      <h1>Login to see your profile</h1>
    </div>)
  }
  
  return (
    <div>
      <h1>Hi, {userEmail}!</h1>
      <h2>Your balance is: {balance}</h2>
      <form onSubmit={handleBalanceUpdate}>
        <input 
          placeholder="balance" 
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
        />  
      </form>
      <button onClick={handleBalanceUpdate} type="button">Add Money</button>
      <button onClick={handleBalanceWithdraw} type="button">Withdraw Money</button>
    </div>
  )
}
  
export default Profile;