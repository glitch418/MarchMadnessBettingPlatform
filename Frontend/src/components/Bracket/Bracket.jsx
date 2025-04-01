import React from 'react';
import "./Bracket.css";

const Bracket = ({ 
  team1 = null,
  team2 = null,
  width = 220, 
  height = 80, 
  winner = null,
  onTeamClick = () => {},
  reverse = false 
}) => {
  const defaultTeam = { seed: '', name: '', score: null };
  const t1 = { ...defaultTeam, ...(team1 || {}) };
  const t2 = { ...defaultTeam, ...(team2 || {}) };

  const boxHeight = height / 2;

  let team1Winner = false;
  let team2Winner = false;
  
  if (team1.score !== null && team2.score !== null) {
      team1Winner = team1.score > team2.score;
      team2Winner = team2.score > team1.score;
  }

  const renderTeamContent = (team) => {
    if (reverse) {
      return (
        <>
          <div className="score">{team.score}</div>
          <div className="team-name">{team.name}</div>
          <div className="seed">{team.seed}</div>
        </>
      );
    } 
    else {
      return (
        <>
          <div className="seed">{team.seed}</div>
          <div className="team-name">{team.name}</div>
          <div className="score">{team.score}</div>
        </>
      );
    }
  };

  return (
    <div className="bracket-container" style={{ width, height }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="xMidYMid meet" 
        className="bracket-svg"
      >
        {/* Top team box */}
        <rect 
          x="0" y="0" 
          width={width} height={boxHeight} 
          fill="transparent" 
          stroke={team1Winner ? "orange" : "black"}
          strokeWidth={team1Winner ? 2 : 1}
        />
        
        {/* Bottom team box */}
        <rect 
          x="0" y={boxHeight} 
          width={width} height={boxHeight} 
          fill="transparent" 
          stroke={team2Winner ? "orange" : "black"} 
          strokeWidth={team2Winner ? 2 : 1}
        />
      </svg>

      {/* Team 1 */}
      <div 
        className="team-box" 
        style={{ 
          top: 0, 
          backgroundColor: team1Winner ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
          color: (!team1Winner && !team2Winner) ? 'black' : team1Winner == false ? "lightgray" : "black"
        }}
        onClick={() => onTeamClick('team1', t1)}
      >
        {renderTeamContent(t1)}
      </div>
      
      {/* Team 2 */}
      <div 
        className="team-box" 
        style={{ 
          top: boxHeight, 
          backgroundColor: team2Winner ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
          color: (!team1Winner && !team2Winner) ? 'black' : team2Winner == false ? "lightgray" : "black"
        }}
        onClick={() => onTeamClick('team2', t2)}
      >
        {renderTeamContent(t2)}
      </div>
    </div>
  );
};

export default Bracket;

{/* 
{t1.image && (
  <div className="">
    <img 
      src={t1.image}
      alt={`${t1.name} logo`}
      className="rounded-full object-contain"
      style={{ width: imageSize, height: imageSize }}
    />
  </div>
)}
*/}
