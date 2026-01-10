import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/Login';
import MainPage from './components/MainPage';
import FileDownloadPage from './components/FileDownloadPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />

        <Route path="/files/*" element={
          <ProtectedRoute>
            <FileDownloadPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
