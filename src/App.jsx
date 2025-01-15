import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import LibraryPage from './pages/LibraryPage';

function App() {

  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/book/:bookId" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
