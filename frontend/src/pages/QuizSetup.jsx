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

  // Load history for the current user
  useEffect(() => {
    if (!username) return;

    const saved = localStorage.getItem(`quizHistory_${username}`);
    setHistory(saved ? JSON.parse(saved) : []);
  }, [username]);

  // Save new result if present
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
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      <div className="bg-[#1a1a2e] p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center">Start a New Quiz</h2>
        <input
          type="text"
          placeholder="Topic (e.g., JavaScript)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 mb-4"
        />
        <input
          type="number"
          placeholder="Number of Questions"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full px-4 py-2 rounded bg-gray-800 mb-6"
        />
        <button
          onClick={handleStart}
          className="w-full py-2 bg-purple-700 hover:bg-purple-800 rounded"
        >
          Start Quiz
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-10 w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">Quiz History ({username})</h3>
          <table className="w-full border-collapse text-sm bg-gray-800 rounded overflow-hidden">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Topic</th>
                <th className="py-2 px-4 text-left">Questions</th>
                <th className="py-2 px-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx} className="border-t border-gray-700">
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
