import React, { useEffect, useState } from 'react';
import Header from './components/UploadPage/Header';
import FileUpload from './components/UploadPage/FileUpload';
import Footer from './components/UploadPage/Footer';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
import SummarizeToWhatsApp from './components/SummarizeToWhatsApp';

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
      <Header />
      <main className="main-content">
        <h1>Marketing Generator</h1>
        <FileUpload />
      </main>
      <Footer />
    </div>

    // <div className="App">
    //   <LoginPage />
    // </div>


    // <div className="App">
    //   <Header />
    //   <main className="main-content">
    //     <SummarizeToWhatsApp />
    //   </main>
    //   <Footer />
    // </div>
  );
}

export default App;
