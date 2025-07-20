import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaCog } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-md mr-2',
        cancelButton: 'bg-gray-300 text-black px-4 py-2 rounded-md',
      },
      buttonsStyling: false,
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // handle logout logic here
        navigate('/');
      }
    });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-zinc-900 shadow-md fixed z-50 top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-indigo-600 dark:text-white">SmartDocAI</div>

          {/* Desktop Nav */}
          {!isMobile && (
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Home</Link>
              <Link to="/upload" className="text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Analyze</Link>

              {/* Settings Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setTimeout(() => setDropdownOpen(false), 400)}
              >
                <div className="cursor-pointer flex items-center space-x-1 text-gray-800 dark:text-white hover:text-indigo-600">
                  <FaCog className="text-xl" />
                  <span>Settings</span>
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => document.documentElement.classList.toggle('dark')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-700 text-sm text-gray-800 dark:text-white"
                    >
                      Toggle Theme
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-700 text-sm text-gray-800 dark:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Auth Buttons */}
              <div className="flex space-x-2">
                <Link to="/login" className="bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-full hover:bg-indigo-500 transition-all">Log In</Link>
                <Link to="/signup" className="bg-pink-500 text-white px-3 py-1.5 text-sm rounded-full hover:bg-pink-400 transition-all">Sign Up</Link>
              </div>
            </div>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-800 dark:text-white">
              <FaBars />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-lg z-50 p-6 transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-indigo-600 dark:text-white">Menu</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-xl text-gray-800 dark:text-white">
                <FaTimes />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-800 dark:text-white hover:text-indigo-600 text-base">Home</Link>
              <Link to="/upload" className="text-gray-800 dark:text-white hover:text-indigo-600 text-base">Analyze</Link>
              <button
                onClick={() => {
                  document.documentElement.classList.toggle('dark');
                }}
                className="text-gray-800 dark:text-white hover:text-indigo-600 text-base text-left"
              >
                Toggle Theme
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-800 dark:text-white hover:text-red-600 text-base text-left"
              >
                Logout
              </button>
              <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-full hover:bg-indigo-500 text-center">Log In</Link>
              <Link to="/signup" className="bg-pink-500 text-white px-4 py-2 text-sm rounded-full hover:bg-pink-400 text-center">Sign Up</Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;