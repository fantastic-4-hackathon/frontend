import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import LoginPage from './components/LoginPage/LoginPage';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';

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
