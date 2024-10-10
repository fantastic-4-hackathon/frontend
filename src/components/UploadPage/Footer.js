import React from 'react';
import './Footer.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column footer-left">
        <img src={require("./logo.png")} alt="Sanlam Logo" />
      </div>
      
      <div className="vertical-line"></div> {/* Vertical line */}
      
      <div className="footer-column footer-center">
        <p>Copyright © 2023<br />
          All rights reserved. Sanlam Life Insurance Limited is a Licensed Financial Services Provider and a Registered Credit Provider.
        </p>
      </div>
      
      <div className="footer-column footer-right">
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-instagram"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-twitter"></i>
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-facebook"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;