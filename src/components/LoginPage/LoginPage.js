import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material'; // Import Snackbar and Alert
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';

const LoginPage = () => {
  const [userEcode, setUserEcode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false); // Use a boolean for error visibility
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      user_Ecode: userEcode,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:5000/user/login', loginData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.message === "Success") {
        toast.success('Login successful');
        sessionStorage.setItem('token', response.data.token);
        navigate('/fileupload', { state: response.data });
      } else {
        setError(true); // Display the snackbar for error
        setErrorMsg(response.data.message || "Login failed");
      }
    } catch (error) {
      setError(true);
      setErrorMsg('Invalid Ecode or password.');
    }
  };

  return (
    <div className="login-page">
      <Box className="login-container" component="form" onSubmit={handleLogin}>
        <img
          src='./images/logo.png'
          alt="Company Logo"
          className="company-logo"
        />
        <Typography variant="h5" className="login-title">Log in to your account</Typography>
        
        {/* Username Input Field */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userEcode}
          onChange={(e) => setUserEcode(e.target.value)}
          required
        />

        {/* Password Input Field */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br></br>

        {/* Terms and Conditions */}
        <Typography variant="body2" className="terms-text">
          By continuing, you agree to our
          <a
            href="https://www.sanlam.com/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
            className="terms-link"
          >
            Terms and Conditions
          </a>
        </Typography>

        <br></br>
      
        {/* Login Button */}
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          type="submit" 
          className="login-button"
        >
          Login
        </Button>
      </Box>

      {/* Snackbar for Error Message */}
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;