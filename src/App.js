import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import LoginPage from './components/LoginPage/LoginPage';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
import SummarizeToWhatsapp from './components/SummarizeToWhatsApp';  // Import the component

function App() {

  const [data, setData] = useState({});


  useEffect(() => {
    fetch("/mem").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (
    <div className="App">
      <LoginPage />
      <h1>File Upload</h1>
      <FileUpload />
      <h1>My Summarization App</h1>
      <SummarizeToWhatsapp /> {/* Use the component */}
    </div>
    // Route switching in future with protected routes
    // <Router>
    //   <Switch>
    //     <Route path="/login" component={Login} />
    //     <ProtectedRoute path="/dashboard" component={Dashboard} />
    //   </Switch>
    // </Router>
  );
}

export default App;
