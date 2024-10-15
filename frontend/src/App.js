import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/Login';
import MainPage from './components/MainPage';
import FileDownloadPage from './components/FileDownloadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/files/:uniqueName" element={<FileDownloadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
