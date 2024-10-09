import React from 'react';
import './Header.css'; 
import Avatar from './Avatar'; // Import the Avatar component
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const { name, surname } = location.state || {
    name: "No text provided",
    surname: "No message provided",
    user_id: "No user_id provided"
};

  return (
    <header className="header">
      <div className="logo">
        <img src={require("./short-logo.png")} alt="Sanlam Logo" />
      </div>
      <nav className="nav">
        {/* Navigation items can be added here */}
      </nav>
      <div className="user-profile">
        <Avatar name={name} surname={surname} /> {/* Include Avatar here */}
      </div>
    </header>
  );
};

export default Header;