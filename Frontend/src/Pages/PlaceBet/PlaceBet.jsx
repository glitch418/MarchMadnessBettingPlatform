import React, { useEffect, useState } from 'react';
import { fetchGames, placeBet } from '../../utils/api';

const PlaceBet = () => {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);
  const [betType, setBetType] = useState('spread');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const gameList = await fetchGames();
        setGames(Array.isArray(gameList) ? gameList : []);
      } catch (error) {
        console.error('Error fetching games:', error);
        showToastMessage('Failed to fetch games from the server.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleGameChange = (gameId) => {
    setSelectedGameId(gameId);
    const game = games.find((g) => g.game_id.toString() === gameId);
    setSelectedGameDetails(game || null);
    setSelectedTeam('');
  };

  const handlePlaceBet = () => {
    if (!selectedGameId || !selectedTeam || !amount) {
      showToastMessage('Please complete all fields before placing a bet.');
      return;
    }
    setShowModal(true);
  };

  const confirmBet = async () => {
    setShowModal(false);
    try {
      const response = await placeBet(selectedGameId, selectedTeam, betType, parseFloat(amount));
      showToastMessage('Bet placed successfully!');
      setSelectedGameId('');
      setSelectedTeam('');
      setAmount('');
      setBetType('spread');
      console.log(response);
    } catch (error) {
      console.error('Bet placement failed:', error);
      showToastMessage('Bet failed. Please try again.');
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Place a New Bet</h2>

      <select value={selectedGameId} onChange={(e) => handleGameChange(e.target.value)}>
        <option value="">Select a game</option>
        {games.map((game) => (
          <option key={game.game_id} value={game.game_id}>
            {game.team1_name} vs {game.team2_name}
          </option>
        ))}
      </select>

      {selectedGameDetails && (
        <>
          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="">Select a team</option>
            <option value="team1">{selectedGameDetails.team1_name}</option>
            <option value="team2">{selectedGameDetails.team2_name}</option>
          </select>

          <p>
            Spread: {selectedTeam === 'team1' ? selectedGameDetails.team1_odds : selectedTeam === 'team2' ? selectedGameDetails.team2_odds : '-'}<br />
            Line: TBD {/* Placeholder for future line data */}
          </p>

          <select value={betType} onChange={(e) => setBetType(e.target.value)}>
            <option value="spread">Spread</option>
            <option value="moneyline">Money Line</option>
          </select>
        </>
      )}

      <input
        type="number"
        placeholder="Enter bet amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handlePlaceBet}>Place Bet</button>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p>Are you sure you want to place this bet?</p>
            <button onClick={confirmBet}>Yes</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showToast && <div style={styles.toast}>{toastMessage}</div>}
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  toast: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '4px',
    zIndex: 1001,
  },
};

export default PlaceBet;
