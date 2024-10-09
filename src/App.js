import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components//UploadPage/Header';
import Footer from './components/UploadPage/Footer';
import FileUpload from './components/UploadPage/FileUpload';
import LoginPage from './components/LoginPage/LoginPage';
import Dummy from './components/Dummy';
import WhatsAppMessage from './components/WhatsAppMessage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className='App'>
      {!isLoginPage && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Use ProtectedRoute for routes that require login */}
          <Route path="/fileupload" element={<ProtectedRoute element={FileUpload} />} />
          <Route path="/dummy" element={<ProtectedRoute element={Dummy} />} />
          <Route path="/whatsapp" element={<ProtectedRoute element={WhatsAppMessage} />} />
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;