import React, { useEffect, useState } from "react";
import { useUserSession } from "../../contexts/UserSessionContext";
import "./MyBets.css";
import Navbar from "../../components/Navbar/Navbar";

const MyBets = () => {
  // Pull login state and user email from session context
  const { isLoggedIn, userEmail } = useUserSession();

  // Local state: fetched bets, loading flag, and any error message
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Effect: when user logs in (or email changes), fetch their bets
  useEffect(() => {
    if (!isLoggedIn) return;            // do nothing if not logged in
    setLoading(true);                   // show spinner

    // Hit backend endpoint to get bets for this user
    fetch(`http://localhost:5001/mybets?email=${encodeURIComponent(userEmail)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch bets");
        return res.json();               // parse JSON if successful
      })
      .then(data => setBets(data))       // put bets into state
      .catch(err => setError(err.message))
      .finally(() => setLoading(false)); // hide spinner
  }, [isLoggedIn, userEmail]);

  // If not logged in, prompt user to log in
  if (!isLoggedIn) {
    return (
      <div className="mybets-container container my-5">
        <h2>Please log in to view your bets</h2>
      </div>
    );
  }

  // Main render: display loading spinner, error, empty state, or table
  return (
    <div className="mybets-container container my-5">
      {/* <Navbar/>  */}
      <h2 className="mb-4">My Bets</h2>

      {loading ? (
        // Loading state
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      ) : error ? (
        // Error state
        <div className="alert alert-danger">{error}</div>
      ) : bets.length === 0 ? (
        // No bets placed yet
        <div className="alert alert-info">
          You have not placed any bets yet.
        </div>
      ) : (
        // Bets table
        <table className="mybets-table table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Bet ID</th>
              <th>Matchup</th>
              <th>Team</th>
              <th>Amount</th>
              <th>Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet) => (
              <tr key={bet.bet_id}>
                <td>{bet.bet_id}</td>                           {/* show bet identifier */}
                <td>{bet.team1_name} vs {bet.team2_name}</td>   {/* show matchup */}
                <td>{bet.team_name}</td>                        {/* show chosen team */}
                <td>${bet.amount.toFixed(2)}</td>               {/* format currency */}
                <td>${bet.payout.toFixed(2)}</td>
                <td
                  className={
                    bet.bet_status === "won"
                      ? "text-success"
                      : bet.bet_status === "lost"
                      ? "text-danger"
                      : ""
                  }
                >
                  {bet.bet_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBets;
