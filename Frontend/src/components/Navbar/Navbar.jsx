import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import home from "../../assets/home.png";
import bet from "../../assets/bet.png";
import search from "../../assets/search.png";
import profile from "../../assets/profile.png";
import games from '../../assets/games-icon.png';
import placeBet from './assets/placebet.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    // Handle navigation
    const handleHomeClick = () => {
        navigate('/');
    };

    // TODO: My bets maybe conditionally rendered based on login status
    const handleBetsClick = () => {
        navigate('/myBets');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };


    const handlePlaceBetClick = () => {
        navigate('/placeBet');
    };
	
    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle search submission
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            // TODO: Implement regex/parsing to match information
            // console.log("Search query:", searchInput);
            // we can either choose to stay at home page and display results or navigate to another page
            // navigate(`/search?query=${encodeURIComponent(searchInput)}`);
            setSearchInput("");
        }
    };

    return (
        <nav>
            {/* Main container */}
            <div className="container">

                {/* Left Element */}
                {/* Home */}
                <div className="nav-item" onClick={handleHomeClick}>
                    <img id="home-icon" src={home} alt="Home" width={35} height={35}/>
                    <p>Home</p>
                </div>

                {/* My Bets */}
                <div className="nav-item" onClick={handleBetsClick}>
                    <img id="bet-icon" src={bet} alt="My Bets" width={35} height={35}/>
                    <p>My Bets</p>
                </div>
				
				{/* Place Bet */}
                <div className="nav-item" onClick={handlePlaceBetClick}>
                    <img id="placebet-icon" src={placeBet} alt="Place Bet" width={35} height={35}/>
                    <p>Place Bet</p>
                </div>
				
				{/* Games */}
				<div className="nav-item" onClick={() => navigate('/games')}>
					<img id="games-icon" src={games} alt="Games" width={35} height={35}/>
					<p>Games</p>
				</div>
            </div>

            {/* Middle Element */}
            {/* Main search bar */}
            <div className="search-container">
                <img id="search-icon" src={search} alt="Search" width={35} height={35}/>
                <input 
                    id="search-bar" 
                    type="text" 
                    placeholder="Search"
                    value={searchInput}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                />
            </div>

            {/* Right element
                Login / Profile 
                TODO: We can implement useContext to share logged in state 
                and optionally handle Profile/Login with if statement
            */}
            <div className="nav-item" onClick={handleLoginClick}>
                <img id="profile-icon" src={profile} alt="Profile" width={35} height={35}/>
                <p>Login</p>
            </div>

        </nav>
    );
}

export default Navbar;