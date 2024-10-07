import React from 'react';
import './LoginPage.css'; // Import the CSS for styling

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* Company Logo */}
      <img 
        src="logo.jpg" 
        alt="Company Logo" 
        className="company-logo" 
      />
      
      {/* Login Container */}
      <div className="login-container">
        <h2 className="login-title">Log in to your account</h2>

        {/* Email / Username Input */}
        <input 
          type="text" 
          placeholder="Email / Username" 
          className="input-field" 
        />
        
        {/* Password Input */}
        <input 
          type="password" 
          placeholder="Password" 
          className="input-field" 
        />

        {/* Terms and Conditions */}
        <p className="terms-text">
          By continuing, you are agreeing to our 
          <a 
            href="https://www.sanlam.com/terms-of-use" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="terms-link"
          >
            Terms and Conditions
          </a>
        </p>

        {/* Login Button */}
        <button className="login-button">Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
