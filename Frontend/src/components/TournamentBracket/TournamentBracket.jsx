import React, { version } from "react";
import "./TournamentBracket.css";
import BracketHeader from "../BracketHeader/BracketHeader";
import Bracket from "../Bracket/Bracket";
import finalFourLogo from "../../assets/finalfourlogo.svg";

/*
Reusable component to render bracket
Team should contain image, seed, name, score
*/
const TournamentBracket = () => {
    const width = 175;
    const height = 75;
    
    return (
        <div className="tournament-container">
            {/* Bracket Header */}
            <div className="bracket-header">
                <BracketHeader />
            </div>

            {/* Bracket Layout */}
            <div className="bracket-grid">
                {/* First Round */}
                <div className="bracket-column" style={{gap: height / 3.75}}>
                    <Bracket team1="Team 1" team2="Team 2" />
                    <Bracket team1="Team 3" team2="Team 4" />
                    <Bracket team1="Team 5" team2="Team 6" />
                    <Bracket team1="Team 7" team2="Team 8" />
                    <Bracket team1="Team 9" team2="Team 10" />
                    <Bracket team1="Team 11" team2="Team 12" />
                    <Bracket team1="Team 13" team2="Team 14" />
                    <Bracket team1="Team 15" team2="Team 16" />
                </div>

                {/* Second Round */}
                <div className="bracket-column" style={{gap: height / (3.75 / 5.75)}}>
                    <Bracket team1="Winner 1" team2="Winner 2" />
                    <Bracket team1="Winner 3" team2="Winner 4" />
                    <Bracket team1="Winner 5" team2="Winner 6" />
                    <Bracket team1="Winner 7" team2="Winner 8" />
                </div>

                {/* Sweet 16 */}
                <div className="bracket-column" style={{gap: height / (3.75 / 15), marginLeft: "-2rem"}}>
                    <Bracket team1="Winner 9" team2="Winner 10" />
                    <Bracket team1="Winner 11" team2="Winner 12" />
                </div>

                {/* Elite 8 */}
                <div className="bracket-column" style={{marginLeft: "-5rem"}}>
                    <Bracket team1="Winner 13" team2="Winner 14" />
                </div>

                {/* Final Four */}
                

                {/* Elite 8 (Right Side) */}
                <div className="bracket-column" style={{marginRight: "-5rem", paddingLeft: "10rem"}}>
                    <Bracket team1="Winner 17" team2="Winner 18" />
                </div>

                {/* Sweet 16 (Right Side) */}
                <div className="bracket-column" style={{gap: height / (3.75 / 15), marginRight: "-2rem"}}>
                    <Bracket team1="Winner 19" team2="Winner 20" />
                    <Bracket team1="Winner 21" team2="Winner 22" />
                </div>

                {/* Second Round (Right Side) */}
                <div className="bracket-column" style={{gap: height / (3.75 / 5.75)}}>
                    <Bracket team1="Winner 23" team2="Winner 24" />
                    <Bracket team1="Winner 25" team2="Winner 26" />
                    <Bracket team1="Winner 27" team2="Winner 28" />
                    <Bracket team1="Winner 29" team2="Winner 30" />
                </div>

                {/* First Round (Right Side) */}
                <div className="bracket-column" style={{gap: height / 3.75}}>
                    <Bracket team1="Team 17" team2="Team 18" />
                    <Bracket team1="Team 19" team2="Team 20" />
                    <Bracket team1="Team 21" team2="Team 22" />
                    <Bracket team1="Team 23" team2="Team 24" />
                    <Bracket team1="Team 25" team2="Team 26" />
                    <Bracket team1="Team 27" team2="Team 28" />
                    <Bracket team1="Team 29" team2="Team 30" />
                    <Bracket team1="Team 31" team2="Team 32" />
                </div>
            </div>

            <div className="final-four">
                <img src={finalFourLogo} alt="Final Four Logo" width={200} height={200}/>
                <div className="final-four-bracket">
                    <Bracket team1="Team 17" team2="Team 18" />
                    <Bracket team1="Team 17" team2="Team 18" />
                    <Bracket team1="Team 17" team2="Team 18" />
                </div>
                
            </div>

            <div className="bracket-grid">
                {/* First Round */}
                <div className="bracket-column" style={{gap: height / 3.75}}>
                    <Bracket team1="Team 1" team2="Team 2" />
                    <Bracket team1="Team 3" team2="Team 4" />
                    <Bracket team1="Team 5" team2="Team 6" />
                    <Bracket team1="Team 7" team2="Team 8" />
                    <Bracket team1="Team 9" team2="Team 10" />
                    <Bracket team1="Team 11" team2="Team 12" />
                    <Bracket team1="Team 13" team2="Team 14" />
                    <Bracket team1="Team 15" team2="Team 16" />
                </div>

                {/* Second Round */}
                <div className="bracket-column" style={{gap: height / (3.75 / 5.75)}}>
                    <Bracket team1="Winner 1" team2="Winner 2" />
                    <Bracket team1="Winner 3" team2="Winner 4" />
                    <Bracket team1="Winner 5" team2="Winner 6" />
                    <Bracket team1="Winner 7" team2="Winner 8" />
                </div>

                {/* Sweet 16 */}
                <div className="bracket-column" style={{gap: height / (3.75 / 15), marginLeft: "-2rem"}}>
                    <Bracket team1="Winner 9" team2="Winner 10" />
                    <Bracket team1="Winner 11" team2="Winner 12" />
                </div>

                {/* Elite 8 */}
                <div className="bracket-column" style={{marginLeft: "-5rem"}}>
                    <Bracket team1="Winner 13" team2="Winner 14" />
                </div>

                {/* Final Four */}
                

                {/* Elite 8 (Right Side) */}
                <div className="bracket-column" style={{marginRight: "-5rem", paddingLeft: "10rem"}}>
                    <Bracket team1="Winner 17" team2="Winner 18" />
                </div>

                {/* Sweet 16 (Right Side) */}
                <div className="bracket-column" style={{gap: height / (3.75 / 15), marginRight: "-2rem"}}>
                    <Bracket team1="Winner 19" team2="Winner 20" />
                    <Bracket team1="Winner 21" team2="Winner 22" />
                </div>

                {/* Second Round (Right Side) */}
                <div className="bracket-column" style={{gap: height / (3.75 / 5.75)}}>
                    <Bracket team1="Winner 23" team2="Winner 24" />
                    <Bracket team1="Winner 25" team2="Winner 26" />
                    <Bracket team1="Winner 27" team2="Winner 28" />
                    <Bracket team1="Winner 29" team2="Winner 30" />
                </div>

                {/* First Round (Right Side) */}
                <div className="bracket-column" style={{gap: height / 3.75}}>
                    <Bracket team1="Team 17" team2="Team 18" />
                    <Bracket team1="Team 19" team2="Team 20" />
                    <Bracket team1="Team 21" team2="Team 22" />
                    <Bracket team1="Team 23" team2="Team 24" />
                    <Bracket team1="Team 25" team2="Team 26" />
                    <Bracket team1="Team 27" team2="Team 28" />
                    <Bracket team1="Team 29" team2="Team 30" />
                    <Bracket team1="Team 31" team2="Team 32" />
                </div>
            </div>
        </div>
    );
};

export default TournamentBracket;
