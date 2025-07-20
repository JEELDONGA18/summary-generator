import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import UploadPage from './Components/UploadPage';
import ChatPage from './Components/ChatPage';

function App() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/chat" element={<ChatPage />} /> 
          </Routes>
        </Router>
      );
    }
    
    export default App;