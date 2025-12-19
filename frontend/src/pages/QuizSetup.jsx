import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Helper to get current user
const getCurrentUsername = () => localStorage.getItem("username") || null;

const QuizSetup = () => {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const username = getCurrentUsername();

  useEffect(() => {
    if (!username) return;
    const saved = localStorage.getItem(`quizHistory_${username}`);
    setHistory(saved ? JSON.parse(saved) : []);
  }, [username]);

  useEffect(() => {
    const newResult = location.state?.quizResult;
    if (!newResult || !username) return;

    setHistory((prev) => {
      const updated = [...prev, newResult];
      localStorage.setItem(`quizHistory_${username}`, JSON.stringify(updated));
      return updated;
    });
  }, [location.state?.quizResult, username]);

  const handleStart = () => {
    if (!topic.trim()) return alert("Please enter a topic!");
    if (count < 1 || count > 50) return alert("Choose between 1 and 50 questions.");
    navigate(`/quiz?topic=${encodeURIComponent(topic)}&count=${count}`);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6 flex flex-col items-center font-inter">
      {/* Glowing Background */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-500 blur-[150px] opacity-30 rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-cyan-500 blur-[150px] opacity-30 rounded-full pointer-events-none" />

      <div className="z-10 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-xl shadow-2xl w-full max-w-md mt-12">
        <h2
          className="text-3xl font-orbitron font-bold mb-6 text-center tracking-wider text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        >
          Start a New Quiz
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Topic (e.g., JavaScript)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="number"
            placeholder="Number of Questions"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleStart}
            className="w-full py-2 bg-gradient-to-r from-cyan-400 to-purple-500 hover:scale-[1.03] rounded text-black font-semibold transition-all shadow-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="z-10 mt-10 w-full max-w-2xl bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-orbitron font-semibold mb-4 text-cyan-300 tracking-wide">
            Quiz History <span className="text-white/60">({username})</span>
          </h3>
          <table className="w-full border-collapse text-sm text-white/90">
            <thead className="bg-white/10 text-cyan-200 font-semibold">
              <tr>
                <th className="py-2 px-4 text-left">Topic</th>
                <th className="py-2 px-4 text-left">Questions</th>
                <th className="py-2 px-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx} className="border-t border-white/10 hover:bg-white/10 transition">
                  <td className="py-2 px-4">{h.topic}</td>
                  <td className="py-2 px-4">{h.total}</td>
                  <td className="py-2 px-4">{h.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizSetup;