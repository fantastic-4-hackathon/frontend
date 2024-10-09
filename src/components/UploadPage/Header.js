import React from 'react';
import './Header.css'; 
import Avatar from './Avatar'; // Import the Avatar component

const Header = () => {
  const userName = "John"; // Replace with dynamic data as needed
  const userSurname = "Doe"; // Replace with dynamic data as needed

  return (
    <header className="header">
      <div className="logo">
        <img src={require("./short-logo.png")} alt="Sanlam Logo" />
      </div>
      <nav className="nav">
        {/* Navigation items can be added here */}
      </nav>
      <div className="user-profile">
        <Avatar name={userName} surname={userSurname} /> {/* Include Avatar here */}
      </div>
    </header>
  );
};

export default Header;