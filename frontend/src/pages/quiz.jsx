// src/pages/Quiz.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Utility function to save quiz results
const saveQuizProgress = (topic, score) => {
  const username = localStorage.getItem("username");
  if (!username || !topic) return;

  const roadmapTopics = [
    "Arrays&Hashing",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Binary Search",
    "Linked List",
    "Trees",
    "Tries",
    "Heap/PQ",
    "Backtracking",
    "Graphs"
  ];

  const isRoadmap = roadmapTopics.includes(topic);
  const storageKey = isRoadmap
    ? `completedTopics_${username}`
    : `completedSideQuests_${username}`;

  const existingData = JSON.parse(localStorage.getItem(storageKey) || "{}");
  existingData[topic] = score;
  localStorage.setItem(storageKey, JSON.stringify(existingData));
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const topic = queryParams.get("topic");
  const count = queryParams.get("count") || 5;

  useEffect(() => {
    const fetchURL = `${import.meta.env.VITE_BACKEND_URL}/quiz/${count}?topic=${encodeURIComponent(topic)}`;

    fetch(fetchURL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error loading quiz questions. Please try again.");
        console.error("Error loading questions:", err);
        setLoading(false);
      });
  }, [topic, count]);

  const handleOptionClick = (selectedIndex) => {
    const updatedAnswers = [
      ...answers,
      {
        questionId: questions[current]._id,
        selectedIndex,
      },
    ];
    setAnswers(updatedAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: updatedAnswers }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to submit quiz");
          return res.json();
        })
        .then((result) => {
          saveQuizProgress(topic, result.score);
          navigate("/quiz/setup", {
            state: {
              quizResult: {
                topic,
                total: questions.length,
                score: result.score,
              },
            },
          });
        })
        .catch((err) => {
          console.error("Error submitting answers:", err);
          alert("Something went wrong while submitting the quiz.");
        });
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const currentQuestion = questions[current];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white px-4 relative">
      {/* Go back to home button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
      >
        ← Home
      </button>

      <div className="max-w-2xl w-full bg-[#1a1a2e] p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">
          Q{current + 1}: {currentQuestion.questionText}
        </h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-lg transition"
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
