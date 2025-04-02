import React from 'react';
import "./Bracket.css";
import { useState } from 'react';
import placeholderTeamIcon from "../../assets/placeholderTeamIcon.png";

const Bracket = ({ 
  team1 = null,
  team2 = null,
  width = 220, 
  height = 80, 
  onTeamClick = () => {},
  reverse = false,
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

  const imgT1 = `${team1.name}.png`;
  const imgT2 = `${team2.name}.png`;

  const renderTeamContent = (team) => {
    const isTeam1 = team.name === team1.name;
    const imgSrc = isTeam1 ? imgT1 : imgT2;
  
    const [src, setSrc] = useState(imgSrc);
    const [imgExists, setImgExists] = useState(true);
  
    return (
      <div className={'team-content'}>
        {imgExists && (
          <img
            src={src}
            alt={`${team.name} logo`}
            className={`logo${reverse ? '-reverse' : ''}`}
            onError={() => {
              setImgExists(false); // setSrc(placeholderTeamIcon)
            }}
          />
        )}
        <div className={`seed${reverse ? '-reverse' : ''}`}>{team.seed}</div>
        <div className={`name${reverse ? '-reverse' : ''}`}>{team.name}</div>
        <div className={`score${reverse ? '-reverse' : ''}`}>{team.score}</div>
      </div>
    );
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
