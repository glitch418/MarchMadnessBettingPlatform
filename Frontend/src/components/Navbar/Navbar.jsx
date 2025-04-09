import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import home from "../../assets/home.png";
import bet from "../../assets/bet.png";
import search from "../../assets/search.png";
import profile from "../../assets/profile.png";
import { useLoginStatus } from "../../contexts/LoginStatusContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const {isLoggedIn, userEmail} = useLoginStatus();

    // Handle navigation
    const handleHomeClick = () => {
        navigate('/');
    };

    const handleBetsClick = () => {
        navigate('/myBets');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle search submission
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            // TODO: Implement regex/parsing to match information
            // console.log("Search query:", searchInput);
            // we can either choose to stay at home page and display results or navigate to another page
            // navigate(`/search?query=${encodeURIComponent(searchInput)}`);
            e.preventDefault();
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
                    <img id="home-icon" src={home} alt="Home"/>
                    <p>Home</p>
                </div>

                {/* My Bets */}
                <div className="nav-item" onClick={handleBetsClick}>
                    <img id="bet-icon" src={bet} alt="My Bets"/>
                    <p>My Bets</p>
                </div>
            </div>

            {/* Middle Element */}
            {/* Main search bar */}
            <div 
                className="search-container" 
                onClick={handleSearchSubmit}>
                <img id="search-icon" src={search} alt="Search"/>
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
            */}
             <div 
                className="nav-item" 
                onClick={isLoggedIn ? handleProfileClick : handleLoginClick}
            >
                <img id="profile-icon" src={profile} alt="Profile"/>
                <p>{isLoggedIn ? userEmail.charAt(0).toUpperCase() : 'Login'}</p>
            </div>

        </nav>
    );
}

export default Navbar;