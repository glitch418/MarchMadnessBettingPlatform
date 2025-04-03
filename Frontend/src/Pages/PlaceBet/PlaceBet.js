import React, { useEffect, useState } from 'react';
import { getGames, placeBet } from '../../utils/api';

const MyBets = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      const gameList = await getGames();
      setGames(gameList);
    };
    fetchGames();
  }, []);

  const handlePlaceBet = async () => {
    // TODO: Validate and send to backend
    if (!selectedGame || !amount) {
      showToastMessage('Please select a game and enter an amount.');
      return;
    }
    setShowModal(true);
  };

  const confirmBet = async () => {
    setShowModal(false);
    const response = await placeBet(selectedGame, amount);
    showToastMessage('Bet placed successfully!');
    console.log(response);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div>
      <h2>Place a New Bet</h2>

      {/* Game Selection */}
      <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
        <option value="">Select a game</option>
        {games.map((game) => (
          <option key={game.game_id} value={game.game_id}>
            {game.team1_id} vs {game.team2_id} {/* Placeholder for names */}
          </option>
        ))}
      </select>

      {/* Amount Input */}
      <input
        type="number"
        placeholder="Enter bet amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Submit */}
      <button onClick={handlePlaceBet}>Place Bet</button>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p>Are you sure you want to place this bet?</p>
            <button onClick={confirmBet}>Yes</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div style={styles.toast}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
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

export default MyBets;
