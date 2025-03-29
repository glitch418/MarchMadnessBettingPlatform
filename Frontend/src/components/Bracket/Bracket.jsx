import React, { useRef, useEffect } from 'react';
import "./Bracket.css";


/*
Reusable component to render bracket
Team should contain image, seed, name, score
*/
const Bracket = ({ team1, team2, width = 175, height = 75 }) => {
    const canvasRef = useRef(null);
    const boxHeight = height / 2;
    const paddingTop = height / 5;
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
  
        context.clearRect(0, 0, width, height);
        context.strokeStyle = "orange";
  
        context.strokeRect(0, 0, width, boxHeight);
        context.strokeRect(0, boxHeight, width, boxHeight);
      }
    }, [team1, team2, width, height, boxHeight]);
  
    return (
      <div className="bracket-container" style={{ width: width, height: height }}>
        <canvas ref={canvasRef} width={width} height={height} />
        <div className="bracket-team bracket-team-1" style={{ height: boxHeight }}>
          <div className="bracket-team-text" style={{ paddingTop: paddingTop }}>
            {team1}
          </div>
        </div>
        <div className="bracket-team bracket-team-2" style={{ height: boxHeight }}>
          <div className="bracket-team-text" style={{ paddingTop: paddingTop }}>
            {team2}
          </div>
        </div>
      </div>
    );
  };
  
  export default Bracket;