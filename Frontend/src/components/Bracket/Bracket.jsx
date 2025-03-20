import React from "react";
import "./Bracket.css";
import BracketHeader from "../BracketHeader/BracketHeader";


const Bracket = ({teamData = {}}) => {
    return (
     <div>
        <BracketHeader/>
        <svg width="800" height="600">
            <line x1="100" y1="50" x2="200" y2="50" stroke="black" />
            <line x1="100" y1="150" x2="200" y2="150" stroke="black" />
            <line x1="200" y1="50" x2="200" y2="150" stroke="black" />
            <text x="50" y="55" fontSize="16">{"team1"}</text>
            <text x="50" y="155" fontSize="16">{"team2"}</text>
         </svg>

     </div>
    )
  }
  
  export default Bracket;