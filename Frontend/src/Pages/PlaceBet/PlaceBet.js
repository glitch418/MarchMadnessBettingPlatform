import React, { useEffect, useState } from 'react';
import { getGames, placeBet } from '../../utils/api';

const MyBets = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const gameList = await getGames();
      setGames(gameList);
    };
    fetchGames();
  }, []);

  const handlePlaceBet = async () => {
    // TODO: Validate and send to backend
    const response = await placeBet(selectedGame, amount);
    console.log(response);
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
    </div>
  );
};

export default MyBets;
