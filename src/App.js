import React from 'react';
import Header from './components/UploadPage/Header';
import FileUpload from './components/UploadPage/FileUpload';
import Footer from './components/UploadPage/Footer';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dummy from './components/Dummy';
import WhatsAppMessage from './components/WhatsAppMessage';

const About = () => <h2>About Page</h2>;
const Contact = () => <h2>Contact Page</h2>;

function App() {

  return (
    <Router>
      <div className='App'>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dummy" element={<Dummy />} />
            <Route path="/whatsapp" element={<WhatsAppMessage /> } />
            <Route path="*" element={<h2>404 Not Found</h2>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
