import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS for styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginPage = () => {
  const [userEcode, setUserEcode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      user_Ecode: userEcode,
      password: password
    };

    try {
      // Send POST request to the Flask API using axios
      const response = await axios.post('http://localhost:5000/user/login', loginData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.message === "Success") {
        toast.success('Login successful');
        console.log("Login successful:", response.data);

        // Store token in sessionStorage
        sessionStorage.setItem('token', response.data.token);

        // setName(response.data.name + ' ' + response.data.surname)

        // Redirect to another page (protected route) after successful login (e.g., dashboard)
        navigate('/fileupload', { state: response.data });
      } else {
        toast.warning(response.data.message || "Failed")
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError('Invalid Ecode or password.');
      toast.error('Login failed');
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
            placeholder="Username"
            className="input-field"
            value={userEcode}
            onChange={(e) => setUserEcode(e.target.value)}
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
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
