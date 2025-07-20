import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center text-white px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to Your Smart AI Document Assistant 📄🤖
        </h1>
        <p className="text-lg mb-8 font-light tracking-wide">
          Upload any of your internal or private documents — company files, research papers, project notes, anything.
          Our intelligent AI agent will read and understand your content, and you can ask anything related to it!
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="bg-white text-indigo-700 hover:bg-indigo-200 transition-all font-semibold px-6 py-3 rounded-xl shadow-xl text-lg"
        >
          Get Started 🚀
        </button>
      </div>
    </div>
  );
};

export default HomePage;