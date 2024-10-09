import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components//UploadPage/Header';
import Footer from './components/UploadPage/Footer'; 
import FileUpload from './components/UploadPage/FileUpload'; 
import LoginPage from './components/LoginPage/LoginPage'; 
import Dummy from './components/Dummy'; 
import WhatsAppMessage from './components/WhatsAppMessage'; 
import './App.css';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='App'>
      {!isLoginPage && <Header/>}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/fileupload" element={<FileUpload />} />
          <Route path="/dummy" element={<Dummy />} />
          <Route path="/whatsapp" element={<WhatsAppMessage />} />
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;