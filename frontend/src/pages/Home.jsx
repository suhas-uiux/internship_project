import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaMapSigns,
  FaUserAlt,
  FaQuestionCircle,
  FaSignInAlt,
  FaUserPlus,
  FaCommentDots,
  FaSignOutAlt,
} from "react-icons/fa";
import LogoutButton from "./LogoutButton";
import ModalAlert from "../components/ModalAlert";

const cards = [
  { title: "ROADMAP", icon: <FaMapSigns size={40} /> },
  { title: "PROFILE", icon: <FaUserAlt size={40} /> },
  { title: "QUIZES", icon: <FaQuestionCircle size={40} /> },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
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

  const handleCardClick = (card, index) => {
    const position = (index - currentIndex + cards.length) % cards.length;
    if (position !== 1) return;

    if (!isLoggedIn) {
      setAlertMessage("Please login to access this section.");
      setShowAlert(true);
      return;
    }

    if (card.title === "ROADMAP") navigate("/content");
    if (card.title === "PROFILE") navigate("/profile");
    if (card.title === "QUIZES") navigate("/quiz/setup");
  };

  const getCardStyle = (index) => {
    const position = (index - currentIndex + cards.length) % cards.length;
    const baseStyle =
      "absolute w-72 h-80 p-6 rounded-2xl text-white flex flex-col items-center justify-center transition-all duration-700 ease-in-out cursor-pointer backdrop-blur-md border border-white/20";

    const glow = "shadow-[0_0_30px_3px_rgba(0,255,255,0.4)]";

    if (position === 0)
      return `${baseStyle} -translate-x-[110%] rotate-y-45 scale-75 z-0 opacity-40 pointer-events-none`;
    else if (position === 1)
      return `${baseStyle} bg-white/10 scale-100 z-10 ${glow} hover:scale-105 shadow-md backdrop-blur-lg`;
    else if (position === 2)
      return `${baseStyle} translate-x-[110%] -rotate-y-45 scale-75 z-0 opacity-40 pointer-events-none`;
    else return "hidden";
  };

  return (
    <div className="h-screen w-screen bg-[#0f0f1a] text-white font-['Inter'] flex flex-col items-center justify-center overflow-hidden relative">
      {/* Neon Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500 blur-[150px] opacity-30 rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500 blur-[150px] opacity-30 rounded-full pointer-events-none" />

      {/* Title */}
      <h1
        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-5xl font-extrabold tracking-wider drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        CrackIT
      </h1>

      {/* Auth Buttons */}
      <div className="absolute top-8 right-10 flex space-x-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 border border-white rounded bg-white/10 hover:bg-cyan-400 hover:text-[#0f0f1a] transition font-semibold shadow-sm backdrop-blur"
            >
              <FaSignOutAlt className="hidden group-hover:inline-block" />
              <span className="group-hover:hidden">Logout</span>
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="group flex items-center gap-2 px-4 py-2 border border-white rounded bg-white/10 hover:bg-cyan-400 hover:text-[#0f0f1a] transition font-semibold shadow-sm backdrop-blur"
            >
              <FaCommentDots className="hidden group-hover:inline-block" />
              <span className="group-hover:hidden">Chat</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="group flex items-center gap-2 px-4 py-2 border border-white rounded bg-white/10 hover:bg-cyan-400 hover:text-[#0f0f1a] transition font-semibold shadow-sm backdrop-blur"
            >
              <FaSignInAlt className="hidden group-hover:inline-block" />
              <span className="group-hover:hidden">Login</span>
            </Link>
            <Link
              to="/register"
              className="group flex items-center gap-2 px-4 py-2 border border-white rounded bg-white/10 hover:bg-cyan-400 hover:text-[#0f0f1a] transition font-semibold shadow-sm backdrop-blur"
            >
              <FaUserPlus className="hidden group-hover:inline-block" />
              <span className="group-hover:hidden">Register</span>
            </Link>
          </>
        )}
      </div>

      {/* Card Slider */}
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
              key={card.title}
              className={getCardStyle(index)}
              onClick={() => handleCardClick(card, index)}
              role={index === currentIndex ? "button" : undefined}
              tabIndex={index === currentIndex ? 0 : -1}
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  index === currentIndex
                ) {
                  handleCardClick(card, index);
                }
              }}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <div className="mb-4 text-cyan-300">{card.icon}</div>
              <div className="text-2xl font-bold">{card.title}</div>
              <p className="text-sm mt-2 text-white/60 px-4 text-center">
                Access your {card.title.toLowerCase()} to track and grow.
              </p>
              <button className="mt-4 px-3 py-1 text-sm border border-cyan-300 rounded hover:bg-cyan-300 hover:text-black transition-all">
                Go
              </button>
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

      {/* Custom Modal Alert */}
      <ModalAlert
        show={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default Home;
