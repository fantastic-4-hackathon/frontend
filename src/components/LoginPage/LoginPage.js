import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS for styling
import axios from 'axios';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });

      // Save the JWT token to localStorage or cookies
      localStorage.setItem('token', response.data.access_token);

      // Redirect user to a protected route after successful login
      window.location.href = '/protected';  // Change to your protected route

      // For every request to a protected route, include the JWT token in the Authorization header
      const token = localStorage.getItem('token');
      console.log(token);
      const response2 = await axios.get('http://localhost:5000/auth/protected', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      {/* Company Logo */}

      <img 
        src='./images/logo.png'
        alt="Company Logo" 
        className="company-logo" 
      />

      {/* Login Container */}
      <div className="login-container">
        <h2 className="login-title">Log in to your account</h2>

        {/* Maybe add DSM Component for error above login stuff */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          {/* Email / Username Input */}
          <input
            type="text"
            placeholder="Email / Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
