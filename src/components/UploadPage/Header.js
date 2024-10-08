import React from 'react';
import './Header.css'; // Import the styling for the header

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={require("./short-logo.png")} alt="Sanlam Logo" />
      </div>
      <nav className="nav">
        <a href="#">Overview</a>
        <a href="#">Manage</a>
        <a href="#">Documents</a>
        <a href="#">Contact us</a>
      </nav>
      <div className="user-profile">
        <img src="user-profile.png" alt="User Profile" />
      </div>
    </header>
  );
};

export default Header;