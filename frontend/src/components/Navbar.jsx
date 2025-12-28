import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaCommentDots } from "react-icons/fa";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              CrackIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/quiz/setup"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Quizzes
            </Link>
            <Link
              to="/quiz"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Take Quiz
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Home
                </Link>
                <Link
                  to="/content"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Courses
                </Link>
                <Link
                  to="/chat"
                  className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1"
                >
                  <FaCommentDots className="text-blue-600" />
                  Chat
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1"
                >
                  <FaUser className="text-blue-600" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 text-2xl"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/quiz/setup"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Quizzes
                  </Link>
                  <Link
                    to="/quiz"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Take Quiz
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/content"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  <Link
                    to="/chat"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Chat
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/quiz/setup"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Quizzes
                  </Link>
                  <Link
                    to="/quiz"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Take Quiz
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
