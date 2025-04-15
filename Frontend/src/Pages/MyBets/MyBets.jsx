import React, { useState, useEffect } from "react";
import { useUserSession } from "../../contexts/UserSessionContext";
import "./MyBets.css";

const MyBets = () => {
  const { isLoggedIn, userEmail } = useUserSession();
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the bets for the logged-in user using their email
  useEffect(() => {
    if (isLoggedIn) {
      // Adjust the URL and query parameters based on your backend API requirements.
      fetch(`http://localhost:5001/mybets?email=${encodeURIComponent(userEmail)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setBets(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching bets:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [isLoggedIn, userEmail]);

  // If the user is not logged in, prompt them to log in.
  if (!isLoggedIn) {
    return (
      <div>
        <h1>Login to see your bets</h1>
      </div>
    );
  }

  // While bets are loading, show a loading message.
  if (loading) {
    return <div>Loading your bets...</div>;
  }

  // Show an error message if the fetch failed.
  if (error) {
    return <div>Error loading bets: {error}</div>;
  }

  return (
    <div className="mybets-container">
      <h1>Hi, {userEmail}!</h1>
      {bets.length === 0 ? (
        <p>You have not placed any bets yet.</p>
      ) : (
        <table className="mybets-table">
          <thead>
            <tr>
              <th>Bet ID</th>
              <th>Game ID</th>
              <th>Team ID</th>
              <th>Amount</th>
              <th>Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bets.map(bet => (
              <tr key={bet.bet_id}>
                <td>{bet.bet_id}</td>
                <td>{bet.game_id}</td>
                <td>{bet.team_id}</td>
                <td>{bet.amount}</td>
                <td>{bet.payout}</td>
                <td>{bet.bet_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBets;
