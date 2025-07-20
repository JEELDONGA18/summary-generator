import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6
      bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 
      dark:from-gray-900 dark:via-gray-800 dark:to-black
      transition-all duration-300 overflow-hidden">

      {/* 🌈 Light Theme Glow Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-pink-400 rounded-full opacity-30 blur-3xl animate-pulse block dark:hidden"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse block dark:hidden"></div>

      {/* 🌌 Dark Theme Glow Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-700 rounded-full opacity-20 blur-3xl animate-pulse hidden dark:block"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600 rounded-full opacity-20 blur-3xl animate-pulse hidden dark:block"></div>

      <div className="text-center max-w-3xl z-10 text-gray-900 dark:text-gray-100">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-xl tracking-tight leading-tight dark:text-white">
          Welcome to Your <span className="text-indigo-700 dark:text-yellow-300">Smart AI</span> Document Assistant 📄🤖
        </h1>

        <p className="text-lg mb-10 font-medium tracking-wide leading-relaxed text-gray-700 dark:text-gray-300">
          Upload any of your internal or private documents — company files, research papers, project notes, anything.
          Our intelligent AI agent will read and understand your content, and you can ask anything related to it!
        </p>

        <button
          onClick={() => navigate('/upload')}
          className="bg-indigo-600 text-white hover:bg-indigo-700 
          dark:bg-indigo-500 dark:hover:bg-indigo-400 
          transition-all font-semibold px-8 py-3 rounded-full shadow-xl text-lg
          border border-indigo-800 dark:border-indigo-400
          hover:scale-105 active:scale-95 duration-200"
        >
          🚀 Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage