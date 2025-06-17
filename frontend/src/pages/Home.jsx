// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const cards = ["ROADMAP", "PROFILE", "QUIZES"];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCardClick = (cardName, index) => {
    const position = (index - currentIndex + cards.length) % cards.length;
    if (position !== 1) return;

    if (!isLoggedIn) {
      alert("Please login to access this section.");
      return;
    }

    if (cardName === "ROADMAP") navigate("/roadmap");
    if (cardName === "PROFILE") navigate("/profile");
    if (cardName === "QUIZES") navigate("/quiz/setup");
  };

  const getCardStyle = (index) => {
    const position = (index - currentIndex + cards.length) % cards.length;
    const baseStyle =
      "absolute w-64 h-72 rounded-2xl border bg-[#1a1a2e] flex items-center justify-center text-2xl tracking-[0.3em] font-semibold transition-all duration-700 ease-in-out cursor-pointer transform-style-3d";

    if (position === 0) {
      return `${baseStyle} -translate-x-[100%] rotate-y-45 scale-75 z-0 opacity-50 backdrop-blur-sm pointer-events-none`;
    } else if (position === 1) {
      return `${baseStyle} translate-x-0 rotate-y-0 scale-100 z-10 shadow-[0_0_30px_3px_rgba(255,255,255,0.4)] pointer-events-auto`;
    } else if (position === 2) {
      return `${baseStyle} translate-x-[100%] -rotate-y-45 scale-75 z-0 opacity-50 backdrop-blur-sm pointer-events-none`;
    } else {
      return "hidden";
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0a0a14] to-[#1a1a2e] text-white flex flex-col items-center justify-center overflow-hidden">
      <h1
        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-5xl font-bold tracking-[0.1em] drop-shadow-[0_0_20px_rgba(255,200,200,0.7)]"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        CrackIT
      </h1>

      <div className="absolute top-8 right-10 space-x-4">
        {isLoggedIn ? (
          <>
            <LogoutButton onLogout={handleLogout} />
            <button
              onClick={() => navigate('/chat')}
              className="px-4 py-2 border border-white rounded hover:bg-white hover:text-[#1a1a2e] transition"
            >
              Chat
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 border border-white rounded hover:bg-white hover:text-[#1a1a2e] transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border border-white rounded hover:bg-white hover:text-[#1a1a2e] transition"
            >
              Register
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center justify-center w-full max-w-6xl px-4 relative mt-20 perspective-[1200px]">
        <button
          aria-label="Previous card"
          onClick={handleLeftClick}
          className="absolute left-0 text-white text-4xl px-4 hover:scale-125 transition z-20"
        >
          {"<"}
        </button>

        <div className="relative flex items-center justify-center w-full h-[400px]">
          {cards.map((card, index) => (
            <div
              key={card}
              className={getCardStyle(index)}
              onClick={() => handleCardClick(card, index)}
              role={index === currentIndex ? "button" : undefined}
              tabIndex={index === currentIndex ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && index === currentIndex) {
                  handleCardClick(card, index);
                }
              }}
            >
              {card}
            </div>
          ))}
        </div>

        <button
          aria-label="Next card"
          onClick={handleRightClick}
          className="absolute right-0 text-white text-4xl px-4 hover:scale-125 transition z-20"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Home;
