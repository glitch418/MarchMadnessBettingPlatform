import React, { useEffect, useState } from 'react';
import { fetchGames, placeBet } from '../../utils/api';
import { useUserSession } from '../../contexts/UserSessionContext';
import "./PlaceBet.css"

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
  const [betType, setBetType] = useState('moneyline');

  // pull balance + updateBalance from context
  const { userId, isLoggedIn, balance, updateBalance } = useUserSession();

  if (!isLoggedIn){
    return <h2>Please log in to view your bets</h2>;
  }

  useEffect(() => {
    const fetchData = async () => {
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

  const getSpread = () => {
    if (!selectedGameDetails || !selectedTeam) return '';
    const isFavored =
      selectedTeam === 'team1'
        ? selectedGameDetails.team_favored_id === selectedGameDetails.team1_id
        : selectedGameDetails.team_favored_id === selectedGameDetails.team2_id;
    return isFavored
      ? selectedGameDetails.favored_spread
      : selectedGameDetails.dog_spread;
  };

  const getMoneyline = () => {
    if (!selectedGameDetails || !selectedTeam) return '';
    const isFavored =
      selectedTeam === 'team1'
        ? selectedGameDetails.team_favored_id === selectedGameDetails.team1_id
        : selectedGameDetails.team_favored_id === selectedGameDetails.team2_id;
    return isFavored
      ? selectedGameDetails.favored_moneyline
      : selectedGameDetails.dog_moneyline;
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

    const team_id =
      selectedTeam === 'team1'
        ? selectedGameDetails.team1_id
        : selectedGameDetails.team2_id;

    const payload = {
      user_id: userId,
      game_id: parseInt(selectedGameId),
      team_id: team_id,
      amount: parseFloat(amount),
      bet_type: betType,
    };

    try {
      await placeBet(payload);
      showToastMessage('Bet placed successfully!');

      // log and immediately deduct the stake from UI balance
      console.log('📉 [PlaceBet] stake:', amount, 'old balance:', balance);
      const newBal = balance - parseFloat(amount);
      updateBalance(newBal);
      console.log('📉 [PlaceBet] new balance (frontend) =', newBal);

      // reset form
      setSelectedGameId('');
      setSelectedTeam('');
      setAmount('');
      setBetType('moneyline');
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

  if (loading) return <div className='pB-loading'>Loading...</div>;

  return (
    <div className='pB-page'>
      <div className="pB-container">
        <h2 className="pB-title">Place a New Bet</h2>

        <div className="pB-form-group">
          <select
            className="pB-select"
            value={selectedGameId}
            onChange={(e) => handleGameChange(e.target.value)}
          >
            <option value="">Select a game</option>
            {games.map((game) => (
              <option key={game.game_id} value={game.game_id}>
                {game.team1_name} vs {game.team2_name}
              </option>
            ))}
          </select>
        </div>

        {selectedGameDetails && (
          <div className="pB-game-details">
            <div className="pB-team-info">
              <strong>{selectedGameDetails.team1_name}:</strong> Spread{' '}
              {selectedGameDetails.team_favored_id === selectedGameDetails.team1_id
                ? selectedGameDetails.favored_spread
                : selectedGameDetails.dog_spread} (Moneyline{' '}
              {selectedGameDetails.team_favored_id === selectedGameDetails.team1_id
                ? selectedGameDetails.favored_moneyline
                : selectedGameDetails.dog_moneyline})
            </div>
            <div className="pB-team-info">
              <strong>{selectedGameDetails.team2_name}:</strong> Spread{' '}
              {selectedGameDetails.team_favored_id === selectedGameDetails.team2_id
                ? selectedGameDetails.favored_spread
                : selectedGameDetails.dog_spread} (Moneyline{' '}
              {selectedGameDetails.team_favored_id === selectedGameDetails.team2_id
                ? selectedGameDetails.favored_moneyline
                : selectedGameDetails.dog_moneyline})
            </div>
          </div>
        )}

        {selectedGameDetails && (
          <div className="pB-form-group">
            <select
              className="pB-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Select a team</option>
              <option value="team1">{selectedGameDetails.team1_name}</option>
              <option value="team2">{selectedGameDetails.team2_name}</option>
            </select>
          </div>
        )}

        <div className="pB-form-group">
          <select 
            className="pB-select"
            value={betType} 
            onChange={(e) => setBetType(e.target.value)}
          >
            <option value="moneyline">Money Line</option>
            <option value="spread">Spread</option>
          </select>
        </div>

        <div className="pB-form-group">
          <input
            className="pB-input"
            type="number"
            placeholder="Enter bet amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button className="pB-button" onClick={handlePlaceBet}>Place Bet</button>

        {showModal && (
          <div className="pB-modal-overlay">
            <div className="pB-modal-content">
              <p>Are you sure you want to place this bet?</p>
              <div className="pB-modal-buttons">
                <button className="pB-button" onClick={confirmBet}>Yes</button>
                <button className="pB-button pB-button-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showToast && <div className="pB-toast">{toastMessage}</div>}
      </div>
    </div>
  );
};

export default PlaceBet;