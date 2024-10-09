import React from 'react';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={require("./short-logo.png")} alt="Sanlam Logo" />
      </div>
      <nav className="nav">
      </nav>
      <div className="user-profile">
        <img src="user-profile.png" alt="User Profile" />
      </div>
    </header>
  );
};

export default Header;